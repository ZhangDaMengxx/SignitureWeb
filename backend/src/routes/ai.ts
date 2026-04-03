import { Router } from 'express'
import { generateTermsFromImage, generateMockTerms } from '../services/gemini.js'
import { aiLimiter } from '../middleware/rateLimiter.js'
import { validateBody } from '../middleware/security.js'
import { generateTermsSchema } from '../utils/validation.js'

const router = Router()

/**
 * 从图片生成设计术语
 * POST /api/ai/generate-terms
 */
router.post(
	'/generate-terms',
	aiLimiter, // AI 调用限流
	validateBody(generateTermsSchema),
	async (req, res, next) => {
		try {
			const { imageBase64, mimeType, useMock } = req.body

			// 使用 Mock 数据（开发测试用）
			if (useMock) {
				const terms = generateMockTerms()
				res.json({ terms, source: 'mock' })
				return
			}

			// 调用 Gemini API
			const terms = await generateTermsFromImage(imageBase64, mimeType)

			if (terms.length === 0) {
				res.status(500).json({ error: '术语生成失败' })
				return
			}

			res.json({ terms, source: 'gemini' })
		} catch (err) {
			next(err)
		}
	}
)

/**
 * 健康检查
 * GET /api/ai/health
 */
router.get('/health', (_req, res) => {
	res.json({
		status: 'ok',
		service: 'gemini',
		apiKeyConfigured: !!process.env.GEMINI_API_KEY,
		timestamp: new Date().toISOString(),
	})
})

export { router as aiRoutes }
