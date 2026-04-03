import { z } from 'zod'

/**
 * 输入验证 Schema
 * 设计意图: 定义严格的输入规则，防止注入和恶意输入
 */

// UUID 验证
export const uuidSchema = z.string().uuid('无效的 ID 格式')

// 周记录验证
export const createWeekSchema = z.object({
	year: z.number().int().min(2000).max(2100),
	weekNumber: z.number().int().min(1).max(53),
})

export const weekParamsSchema = z.object({
	year: z.string().regex(/^\d{4}$/, '年份必须是 4 位数字'),
	weekNumber: z.string().regex(/^\d{1,2}$/, '周数必须是 1-2 位数字'),
})

// 卡片验证
export const createCardSchema = z.object({
	weekId: z.string().uuid('无效的周 ID'),
	dayOfWeek: z.enum(['MON', 'TUE', 'WED', 'THU', 'FRI', 'WEEKEND']),
})

// 术语验证
export const createTermSchema = z.object({
	cardId: z.string().uuid('无效的卡片 ID'),
	text: z.string()
		.min(1, '术语不能为空')
		.max(50, '术语长度不能超过 50 个字符')
		.regex(/^[^<>\"'&]*$/, '术语包含非法字符'),
	isAiGenerated: z.boolean().optional(),
})

export const updateTermSchema = z.object({
	text: z.string()
		.min(1, '术语不能为空')
		.max(50, '术语长度不能超过 50 个字符')
		.regex(/^[^<>\"'&]*$/, '术语包含非法字符'),
})

export const batchTermsSchema = z.object({
	cardId: z.string().uuid('无效的卡片 ID'),
	termList: z.array(
		z.string()
			.min(1, '术语不能为空')
			.max(50, '术语长度不能超过 50 个字符')
			.regex(/^[^<>\"'&]*$/, '术语包含非法字符')
	).max(10, '一次最多添加 10 个术语'),
})

// AI 生成验证
export const generateTermsSchema = z.object({
	imageBase64: z.string()
		.min(100, '图片数据无效')
		.max(10 * 1024 * 1024, '图片数据过大'), // 10MB
	mimeType: z.enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
	useMock: z.boolean().optional(),
})

// 文件上传验证（非 JSON，需要单独处理）
export const ALLOWED_MIME_TYPES = [
	'image/jpeg',
	'image/png',
	'image/gif',
	'image/webp',
] as const

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// 查询参数验证
export const querySchema = z.object({
	cardId: z.string().uuid('无效的卡片 ID').optional(),
	weekId: z.string().uuid('无效的周 ID').optional(),
	page: z.string().regex(/^\d+$/).optional(),
	limit: z.string().regex(/^\d+$/).optional(),
})

// 数字参数转换
export function parseNumberParam(value: string | undefined, defaultValue: number): number {
	if (!value) return defaultValue
	const parsed = parseInt(value, 10)
	return isNaN(parsed) ? defaultValue : parsed
}
