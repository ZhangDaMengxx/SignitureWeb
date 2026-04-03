import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import { cardRoutes } from './routes/cards.js'
import { weekRoutes } from './routes/weeks.js'
import { termRoutes } from './routes/terms.js'
import { errorHandler } from './middleware/errorHandler.js'

// 加载环境变量
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

/**
 * 安全配置中间件
 */
app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			imgSrc: ["'self'", "data:", "blob:"],
		},
	},
}))

app.use(cors({
	origin: process.env.FRONTEND_URL || 'http://localhost:5173',
	credentials: true,
}))

/**
 * 速率限制
 * 设计意图: 防止API滥用和暴力攻击
 */
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15分钟
	max: 100, // 每IP限制100请求
	message: { error: '请求过于频繁，请稍后再试' },
})
app.use('/api/', limiter)

/**
 * 文件上传限制
 */
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * 静态文件服务
 */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

/**
 * API路由
 */
app.use('/api/cards', cardRoutes)
app.use('/api/weeks', weekRoutes)
app.use('/api/terms', termRoutes)

/**
 * 健康检查
 */
app.get('/health', (_req, res) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

/**
 * 全局错误处理
 */
app.use(errorHandler)

/**
 * 启动服务器
 */
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
