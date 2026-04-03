/**
 * Vercel Serverless Function 入口
 * 设计意图: 适配 Vercel 的无服务器架构
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config()

// 创建 Express 应用
const app = express()

/**
 * 基础中间件
 */
app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			imgSrc: ["'self'", "data:", "blob:", "https:"],
			scriptSrc: ["'self'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
		},
	},
}))

app.use(cors({
	origin: process.env.FRONTEND_URL || '*',
	credentials: true,
}))

app.use(express.json({ limit: '1mb' }))

/**
 * 健康检查
 */
app.get('/api/health', (_req, res) => {
	res.json({
		status: 'ok',
		platform: 'vercel',
		timestamp: new Date().toISOString(),
	})
})

/**
 * 导出 Vercel handler
 */
export default (req: VercelRequest, res: VercelResponse) => {
	app(req, res)
}
