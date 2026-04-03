import { Router } from 'express'
import { generateTermsFromImage, generateMockTerms } from '../services/gemini.js'

const router = Router()

/**
 * 从图片生成设计术语
 * POST /api/ai/generate-terms
 */
router.post('/generate-terms', async (req, res, next) => {
	try {
		const { imageBase64, mimeType, useMock } = req.body

		// 使用 Mock 数据（开发测试用）
		if (useMock) {
			const terms = generateMockTerms()
			res.json({ terms, source: 'mock' })
			return
		}

		// 验证参数
		if (!imageBase64 || !mimeType) {
			res.status(400).json({ error: '缺少必要参数: imageBase64, mimeType' })
			return
		}

		// 验证图片类型
		const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
		if (!allowedTypes.includes(mimeType)) {
			res.status(400).json({ error: '不支持的图片格式' })
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
})

/**
 * 健康检查
 * GET /api/ai/health
 */
router.get('/health', (_req, res) => {
	res.json({ 
		status: 'ok', 
		service: 'gemini',
		apiKeyConfigured: !!process.env.GEMINI_API_KEY 
	})
})

export { router as aiRoutes }
