import { pgTable, uuid, integer, timestamp, text, boolean, index } from 'drizzle-orm/pg-core'

/**
 * 周记录表
 * 设计意图: 存储每一周的基本信息
 */
export const weeks = pgTable('weeks', {
	id: uuid('id').primaryKey().defaultRandom(),
	year: integer('year').notNull(),
	weekNumber: integer('week_number').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
	uniqueWeek: index('unique_week_idx').on(table.year, table.weekNumber),
}))

/**
 * 灵感卡片表
 * 设计意图: 存储用户上传的图片信息
 */
export const cards = pgTable('cards', {
	id: uuid('id').primaryKey().defaultRandom(),
	weekId: uuid('week_id').references(() => weeks.id, { onDelete: 'cascade' }).notNull(),
	dayOfWeek: text('day_of_week', { enum: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'WEEKEND'] }).notNull(),
	imageUrl: text('image_url').notNull(),
	imagePath: text('image_path').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
	weekDayIdx: index('week_day_idx').on(table.weekId, table.dayOfWeek),
}))

/**
 * 设计术语表
 * 设计意图: 存储每张卡片关联的设计术语
 */
export const terms = pgTable('terms', {
	id: uuid('id').primaryKey().defaultRandom(),
	cardId: uuid('card_id').references(() => cards.id, { onDelete: 'cascade' }).notNull(),
	text: text('text').notNull(),
	isAiGenerated: boolean('is_ai_generated').default(false).notNull(),
	orderIndex: integer('order_index').default(0).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
	cardIdx: index('card_idx').on(table.cardId),
}))

// 类型导出
export type Week = typeof weeks.$inferSelect
export type Card = typeof cards.$inferSelect
export type Term = typeof terms.$inferSelect
export type NewWeek = typeof weeks.$inferInsert
export type NewCard = typeof cards.$inferInsert
export type NewTerm = typeof terms.$inferInsert
