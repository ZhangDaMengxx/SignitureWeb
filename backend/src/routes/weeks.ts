import { Router } from 'express'
import { eq, and } from 'drizzle-orm'
import { db } from '../models/db.js'
import { weeks } from '../models/schema.js'
import { validateBody, validateParams } from '../middleware/security.js'
import { createWeekSchema, weekParamsSchema } from '../utils/validation.js'

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
router.get(
	'/:year/:weekNumber',
	validateParams(weekParamsSchema),
	async (req, res, next) => {
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
	}
)

/**
 * 创建周记录
 * POST /api/weeks
 */
router.post(
	'/',
	validateBody(createWeekSchema),
	async (req, res, next) => {
		try {
			const { year, weekNumber } = req.body

			const [week] = await db.insert(weeks).values({
				year,
				weekNumber,
			}).returning()

			res.status(201).json(week)
		} catch (err) {
			// 处理唯一约束冲突
			if (err instanceof Error && err.message.includes('unique constraint')) {
				res.status(409).json({ error: '该周记录已存在' })
				return
			}
			next(err)
		}
	}
)

export { router as weekRoutes }
