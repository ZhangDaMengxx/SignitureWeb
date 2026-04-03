import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

/**
 * 输入验证中间件工厂
 * 设计意图: 使用 Zod 进行严格的输入验证，防止注入攻击
 */
export function validateBody<T>(schema: z.ZodSchema<T>) {
	return (req: Request, res: Response, next: NextFunction): void => {
		const result = schema.safeParse(req.body)

		if (!result.success) {
			res.status(400).json({
				error: '输入验证失败',
				details: result.error.errors.map(e => ({
					field: e.path.join('.'),
					message: e.message,
				})),
			})
			return
		}

		// 将验证后的数据附加到请求
		req.body = result.data
		next()
	}
}

/**
 * 参数验证中间件
 */
export function validateParams<T>(schema: z.ZodSchema<T>) {
	return (req: Request, res: Response, next: NextFunction): void => {
		const result = schema.safeParse(req.params)

		if (!result.success) {
			res.status(400).json({
				error: '参数验证失败',
				details: result.error.errors,
			})
			return
		}

		req.params = result.data as Record<string, string>
		next()
	}
}

/**
 * SQL 注入检测
 * 设计意图: 检测常见的 SQL 注入模式
 */
const SQL_INJECTION_PATTERNS = [
	/(%27)|(\')|(--)|(%23)|(#)/i,           // 单引号、注释
	/((%3D)|(=))[^\n]*((%27)|(\')|(--)|(%3B)|(;))/i, // 等号+引号
	/\w*((%27)|(\'))((%6F)|o|(%4F))((%72)|r|(%52))/i, // 'or
	/((%27)|(\'))union/i,                   // 'union
	/exec(\s|\+)+(s|x)p\w+/i,                // exec xp_
	/UNION\s+SELECT/i,                       // UNION SELECT
	/INSERT\s+INTO/i,                        // INSERT INTO
	/DELETE\s+FROM/i,                        // DELETE FROM
	/DROP\s+TABLE/i,                         // DROP TABLE
]

export function sqlInjectionCheck(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	const checkValue = (value: string): boolean => {
		return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(value))
	}

	const checkObject = (obj: unknown): boolean => {
		if (typeof obj === 'string') {
			return checkValue(obj)
		}
		if (typeof obj === 'object' && obj !== null) {
			return Object.values(obj).some(checkObject)
		}
		return false
	}

	if (checkObject(req.body) || checkObject(req.query) || checkObject(req.params)) {
		console.warn('检测到潜在 SQL 注入攻击:', {
			ip: req.ip,
			path: req.path,
			body: req.body,
			query: req.query,
		})
		res.status(403).json({ error: '请求包含非法字符' })
		return
	}

	next()
}

/**
 * XSS 防护
 * 设计意图: 转义 HTML 特殊字符，防止 XSS 攻击
 */
const XSS_PATTERNS = [
	/<script[^>]*>[\s\S]*?<\/script>/gi,    // <script>
	/<iframe[^>]*>[\s\S]*?<\/iframe>/gi,    // <iframe>
	/on\w+\s*=/gi,                          // onerror=, onclick= 等
	/javascript:/gi,                         // javascript: 协议
	/data:text\/html/gi,                     // data:text/html
]

function sanitizeString(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')
}

export function xssProtection(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	const checkXSS = (value: string): boolean => {
		return XSS_PATTERNS.some(pattern => pattern.test(value))
	}

	const sanitizeObject = (obj: unknown): unknown => {
		if (typeof obj === 'string') {
			if (checkXSS(obj)) {
				console.warn('检测到潜在 XSS 攻击，已转义:', obj.substring(0, 50))
			}
			return sanitizeString(obj)
		}
		if (Array.isArray(obj)) {
			return obj.map(sanitizeObject)
		}
		if (typeof obj === 'object' && obj !== null) {
			const result: Record<string, unknown> = {}
			for (const [key, value] of Object.entries(obj)) {
				result[key] = sanitizeObject(value)
			}
			return result
		}
		return obj
	}

	req.body = sanitizeObject(req.body)
	req.query = sanitizeObject(req.query) as Record<string, string>

	next()
}

/**
 * 请求大小限制
 */
export function requestSizeLimit(maxSize: number = 10 * 1024 * 1024) {
	return (req: Request, res: Response, next: NextFunction): void => {
		const contentLength = parseInt(req.headers['content-length'] || '0')

		if (contentLength > maxSize) {
			res.status(413).json({
				error: '请求体过大',
				maxSize: `${maxSize / 1024 / 1024}MB`,
			})
			return
		}

		next()
	}
}

/**
 * 安全响应头
 */
export function securityHeaders(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	// 禁止 MIME 嗅探
	res.setHeader('X-Content-Type-Options', 'nosniff')
	// XSS 保护
	res.setHeader('X-XSS-Protection', '1; mode=block')
	// 点击劫持保护
	res.setHeader('X-Frame-Options', 'DENY')
	// HSTS (强制 HTTPS)
	res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
	// 引用策略
	res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
	// 权限策略
	res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

	next()
}
