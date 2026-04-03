import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../models/db.js'
import { terms } from '../models/schema.js'
import { validateBody } from '../middleware/security.js'
import { createTermSchema, updateTermSchema, batchTermsSchema, uuidSchema } from '../utils/validation.js'

const router = Router()

/**
 * 获取卡片的所有术语
 * GET /api/terms?cardId=:cardId
 */
router.get('/', async (req, res, next) => {
	try {
		const { cardId } = req.query

		if (!cardId || typeof cardId !== 'string') {
			res.status(400).json({ error: '缺少参数: cardId' })
			return
		}

		// 验证 UUID
		const parseResult = uuidSchema.safeParse(cardId)
		if (!parseResult.success) {
			res.status(400).json({ error: '无效的 cardId 格式' })
			return
		}

		const result = await db.query.terms.findMany({
			where: eq(terms.cardId, cardId),
			orderBy: (terms, { asc }) => [asc(terms.orderIndex)],
		})

		res.json(result)
	} catch (err) {
		next(err)
	}
})

/**
 * 创建术语
 * POST /api/terms
 */
router.post(
	'/',
	validateBody(createTermSchema),
	async (req, res, next) => {
		try {
			const { cardId, text, isAiGenerated } = req.body

			const [term] = await db.insert(terms).values({
				cardId,
				text,
				isAiGenerated: isAiGenerated ?? false,
			}).returning()

			res.status(201).json(term)
		} catch (err) {
			next(err)
		}
	}
)

/**
 * 批量创建术语（AI生成结果）
 * POST /api/terms/batch
 */
router.post(
	'/batch',
	validateBody(batchTermsSchema),
	async (req, res, next) => {
		try {
			const { cardId, termList } = req.body

			const values = termList.map((text: string, index: number) => ({
				cardId,
				text,
				isAiGenerated: true,
				orderIndex: index,
			}))

			const result = await db.insert(terms).values(values).returning()
			res.status(201).json(result)
		} catch (err) {
			next(err)
		}
	}
)

/**
 * 更新术语
 * PUT /api/terms/:id
 */
router.put(
	'/:id',
	validateBody(updateTermSchema),
	async (req, res, next) => {
		try {
			const { text } = req.body
			const { id } = req.params

			// 验证 UUID
			const parseResult = uuidSchema.safeParse(id)
			if (!parseResult.success) {
				res.status(400).json({ error: '无效的术语 ID 格式' })
				return
			}

			const [term] = await db
				.update(terms)
				.set({ text })
				.where(eq(terms.id, id))
				.returning()

			if (!term) {
				res.status(404).json({ error: '术语不存在' })
				return
			}

			res.json(term)
		} catch (err) {
			next(err)
		}
	}
)

/**
 * 删除术语
 * DELETE /api/terms/:id
 */
router.delete('/:id', async (req, res, next) => {
	try {
		const { id } = req.params

		// 验证 UUID
		const parseResult = uuidSchema.safeParse(id)
		if (!parseResult.success) {
			res.status(400).json({ error: '无效的术语 ID 格式' })
			return
		}

		const result = await db.delete(terms).where(eq(terms.id, id)).returning()

		if (result.length === 0) {
			res.status(404).json({ error: '术语不存在' })
			return
		}

		res.status(204).send()
	} catch (err) {
		next(err)
	}
})

export { router as termRoutes }
