import rateLimit from 'express-rate-limit'
import type { Request, Response } from 'express'

/**
 * 通用限流配置
 * 设计意图: 防止 API 滥用和暴力攻击
 */
export const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 分钟
	max: 100, // 每 IP 限制 100 请求
	message: {
		error: '请求过于频繁，请稍后再试',
		retryAfter: '15分钟',
	},
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req: Request, res: Response) => {
		console.warn('限流触发:', {
			ip: req.ip,
			path: req.path,
			timestamp: new Date().toISOString(),
		})
		res.status(429).json({
			error: '请求过于频繁，请稍后再试',
			retryAfter: Math.ceil(15 * 60),
		})
	},
})

/**
 * 严格限流 - 用于敏感操作
 */
export const strictLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 分钟
	max: 10, // 每 IP 限制 10 请求
	message: {
		error: '操作过于频繁，请稍后再试',
	},
})

/**
 * 上传限流
 */
export const uploadLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 分钟
	max: 5, // 每 IP 限制 5 次上传
	message: {
		error: '上传过于频繁，请稍后再试',
	},
})

/**
 * AI 生成限流
 */
export const aiLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 分钟
	max: 10, // 每 IP 限制 10 次 AI 调用
	message: {
		error: 'AI 生成过于频繁，请稍后再试',
	},
})

/**
 * 登录/注册限流（预留）
 */
export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 分钟
	max: 5, // 每 IP 限制 5 次登录尝试
	message: {
		error: '登录尝试次数过多，请 15 分钟后再试',
	},
	skipSuccessfulRequests: true, // 成功的请求不计数
})
