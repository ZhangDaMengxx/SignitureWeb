import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../models/db.js'
import { terms } from '../models/schema.js'

const router = Router()

/**
 * 获取卡片的所有术语
 * GET /api/terms?cardId=:cardId
 */
router.get('/', async (req, res, next) => {
	try {
		const { cardId } = req.query

		if (!cardId) {
			res.status(400).json({ error: '缺少参数: cardId' })
			return
		}

		const result = await db.query.terms.findMany({
			where: eq(terms.cardId, cardId as string),
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
router.post('/', async (req, res, next) => {
	try {
		const { cardId, text, isAiGenerated } = req.body

		if (!cardId || !text) {
			res.status(400).json({ error: '缺少必要参数: cardId, text' })
			return
		}

		const [term] = await db.insert(terms).values({
			cardId,
			text,
			isAiGenerated: isAiGenerated ?? false,
		}).returning()

		res.status(201).json(term)
	} catch (err) {
		next(err)
	}
})

/**
 * 批量创建术语（AI生成结果）
 * POST /api/terms/batch
 */
router.post('/batch', async (req, res, next) => {
	try {
		const { cardId, termList } = req.body

		if (!cardId || !Array.isArray(termList)) {
			res.status(400).json({ error: '缺少必要参数: cardId, termList' })
			return
		}

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
})

/**
 * 更新术语
 * PUT /api/terms/:id
 */
router.put('/:id', async (req, res, next) => {
	try {
		const { text } = req.body

		if (!text) {
			res.status(400).json({ error: '缺少参数: text' })
			return
		}

		const [term] = await db
			.update(terms)
			.set({ text })
			.where(eq(terms.id, req.params.id))
			.returning()

		res.json(term)
	} catch (err) {
		next(err)
	}
})

/**
 * 删除术语
 * DELETE /api/terms/:id
 */
router.delete('/:id', async (req, res, next) => {
	try {
		await db.delete(terms).where(eq(terms.id, req.params.id))
		res.status(204).send()
	} catch (err) {
		next(err)
	}
})

export { router as termRoutes }
