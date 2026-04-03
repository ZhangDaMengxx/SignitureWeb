/**
 * 星期几枚举
 */
export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'WEEKEND'

/**
 * 设计术语
 */
export interface Term {
	id: string
	cardId: string
	text: string
	isAiGenerated: boolean
	orderIndex: number
}

/**
 * 灵感卡片
 */
export interface Card {
	id: string
	weekId: string
	dayOfWeek: DayOfWeek
	imageUrl: string
	imagePath: string
	terms: Term[]
	createdAt: string
}

/**
 * 周记录
 */
export interface Week {
	id: string
	year: number
	weekNumber: number
	cards: Card[]
	createdAt: string
}

/**
 * 拖拽项类型
 */
export interface DragItem {
	id: string
	dayOfWeek: DayOfWeek
}
