import type { Request, Response, NextFunction } from 'express'

/**
 * 全局错误处理中间件
 * 设计意图: 统一错误格式，隐藏敏感信息
 */
export function errorHandler(
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction
): void {
	console.error('Error:', err.message)

	// 开发环境显示详细错误
	const isDev = process.env.NODE_ENV === 'development'

	res.status(500).json({
		error: '服务器内部错误',
		message: isDev ? err.message : undefined,
		stack: isDev ? err.stack : undefined,
	})
}
