import { Router } from 'express'
import { eq, and } from 'drizzle-orm'
import { db } from '../models/db.js'
import { weeks } from '../models/schema.js'

const router = Router()

/**
 * 获取所有周
 * GET /api/weeks
 */
router.get('/', async (_req, res, next) => {
	try {
		const result = await db.query.weeks.findMany({
			with: {
				cards: {
					with: { terms: true },
				},
			},
			orderBy: (weeks, { desc }) => [desc(weeks.year), desc(weeks.weekNumber)],
		})
		res.json(result)
	} catch (err) {
		next(err)
	}
})

/**
 * 获取指定周
 * GET /api/weeks/:year/:weekNumber
 */
router.get('/:year/:weekNumber', async (req, res, next) => {
	try {
		const year = parseInt(req.params.year)
		const weekNumber = parseInt(req.params.weekNumber)

		const week = await db.query.weeks.findFirst({
			where: and(
				eq(weeks.year, year),
				eq(weeks.weekNumber, weekNumber)
			),
			with: {
				cards: {
					with: { terms: true },
				},
			},
		})

		if (!week) {
			res.status(404).json({ error: '周记录不存在' })
			return
		}

		res.json(week)
	} catch (err) {
		next(err)
	}
})

/**
 * 创建周记录
 * POST /api/weeks
 */
router.post('/', async (req, res, next) => {
	try {
		const { year, weekNumber } = req.body

		if (!year || !weekNumber) {
			res.status(400).json({ error: '缺少必要参数: year, weekNumber' })
			return
		}

		const [week] = await db.insert(weeks).values({
			year,
			weekNumber,
		}).returning()

		res.status(201).json(week)
	} catch (err) {
		next(err)
	}
})

export { router as weekRoutes }
