import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../models/db.js'
import { cards } from '../models/schema.js'
import { upload } from '../middleware/upload.js'
import { uploadLimiter } from '../middleware/rateLimiter.js'
import { uuidSchema } from '../utils/validation.js'

const router = Router()

/**
 * 获取所有卡片
 * GET /api/cards
 */
router.get('/', async (_req, res, next) => {
	try {
		const result = await db.query.cards.findMany({
			with: {
				terms: true,
			},
		})
		res.json(result)
	} catch (err) {
		next(err)
	}
})

/**
 * 获取单张卡片
 * GET /api/cards/:id
 */
router.get('/:id', async (req, res, next) => {
	try {
		// 验证 UUID
		const parseResult = uuidSchema.safeParse(req.params.id)
		if (!parseResult.success) {
			res.status(400).json({ error: '无效的卡片 ID 格式' })
			return
		}

		const card = await db.query.cards.findFirst({
			where: eq(cards.id, req.params.id),
			with: { terms: true },
		})

		if (!card) {
			res.status(404).json({ error: '卡片不存在' })
			return
		}

		res.json(card)
	} catch (err) {
		next(err)
	}
})

/**
 * 创建卡片（带图片上传）
 * POST /api/cards
 */
router.post(
	'/',
	uploadLimiter, // 上传限流
	upload.single('image'),
	async (req, res, next) => {
		try {
			if (!req.file) {
				res.status(400).json({ error: '请上传图片' })
				return
			}

			const { weekId, dayOfWeek } = req.body

			// 验证必要参数
			if (!weekId || !dayOfWeek) {
				res.status(400).json({ error: '缺少必要参数: weekId, dayOfWeek' })
				return
			}

			// 验证 UUID
			const weekIdResult = uuidSchema.safeParse(weekId)
			if (!weekIdResult.success) {
				res.status(400).json({ error: '无效的 weekId 格式' })
				return
			}

			// 验证 dayOfWeek
			const validDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'WEEKEND']
			if (!validDays.includes(dayOfWeek)) {
				res.status(400).json({ error: '无效的 dayOfWeek' })
				return
			}

			const imageUrl = `/uploads/${req.file.filename}`

			const [card] = await db.insert(cards).values({
				weekId,
				dayOfWeek,
				imageUrl,
				imagePath: req.file.path,
			}).returning()

			res.status(201).json(card)
		} catch (err) {
			next(err)
		}
	}
)

/**
 * 删除卡片
 * DELETE /api/cards/:id
 */
router.delete('/:id', async (req, res, next) => {
	try {
		// 验证 UUID
		const parseResult = uuidSchema.safeParse(req.params.id)
		if (!parseResult.success) {
			res.status(400).json({ error: '无效的卡片 ID 格式' })
			return
		}

		const result = await db.delete(cards).where(eq(cards.id, req.params.id)).returning()

		if (result.length === 0) {
			res.status(404).json({ error: '卡片不存在' })
			return
		}

		res.status(204).send()
	} catch (err) {
		next(err)
	}
})

export { router as cardRoutes }
