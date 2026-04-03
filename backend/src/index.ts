import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import { cardRoutes } from './routes/cards.js'
import { weekRoutes } from './routes/weeks.js'
import { termRoutes } from './routes/terms.js'
import { aiRoutes } from './routes/ai.js'
import { errorHandler } from './middleware/errorHandler.js'
import { 
	sqlInjectionCheck, 
	xssProtection, 
	requestSizeLimit,
	securityHeaders 
} from './middleware/security.js'
import { generalLimiter } from './middleware/rateLimiter.js'

// 加载环境变量
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

/**
 * 基础安全中间件
 */
app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			imgSrc: ["'self'", "data:", "blob:", "https:"],
			scriptSrc: ["'self'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
			fontSrc: ["'self'", "https:", "data:"],
		},
	},
	crossOriginEmbedderPolicy: false, // 允许图片跨域
}))

app.use(cors({
	origin: process.env.FRONTEND_URL || 'http://localhost:5173',
	credentials: true,
}))

/**
 * 自定义安全中间件
 */
app.use(securityHeaders)
app.use(requestSizeLimit(10 * 1024 * 1024)) // 10MB 限制
app.use(xssProtection)
app.use(sqlInjectionCheck)

/**
 * 速率限制
 */
app.use('/api/', generalLimiter)

/**
 * 请求解析
 */
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

/**
 * 静态文件服务
 */
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
	maxAge: '1d', // 缓存 1 天
}))

/**
 * 安全相关的响应头
 */
app.use((req, res, next) => {
	// 不暴露服务器信息
	res.removeHeader('X-Powered-By')
	next()
})

/**
 * 请求日志（开发环境）
 */
if (process.env.NODE_ENV === 'development') {
	app.use((req, _res, next) => {
		console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
		next()
	})
}

/**
 * API 路由
 */
app.use('/api/cards', cardRoutes)
app.use('/api/weeks', weekRoutes)
app.use('/api/terms', termRoutes)
app.use('/api/ai', aiRoutes)

/**
 * 健康检查
 */
app.get('/health', (_req, res) => {
	res.json({ 
		status: 'ok', 
		timestamp: new Date().toISOString(),
		version: process.env.npm_package_version || '1.0.0',
		env: process.env.NODE_ENV || 'development',
	})
})

/**
 * 404 处理
 */
app.use((_req, res) => {
	res.status(404).json({ error: '接口不存在' })
})

/**
 * 全局错误处理
 */
app.use(errorHandler)

/**
 * 启动服务器
 */
app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`)
	console.log(`📁 Upload directory: ${path.join(__dirname, '../uploads')}`)
	console.log(`🔒 Security middleware enabled`)
})
