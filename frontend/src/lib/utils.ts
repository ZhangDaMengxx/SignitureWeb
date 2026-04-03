import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并 Tailwind CSS 类名
 * 设计意图: 支持条件类名合并与冲突解决
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * 格式化日期为周视图显示
 */
export function formatWeekRange(date: Date): string {
	const start = new Date(date)
	const day = start.getDay()
	const diff = start.getDate() - day + (day === 0 ? -6 : 1)
	start.setDate(diff)
	
	const end = new Date(start)
	end.setDate(start.getDate() + 6)
	
	return `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`
}

/**
 * 获取当前是第几周
 */
export function getWeekNumber(date: Date): number {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
	const dayNum = d.getUTCDay() || 7
	d.setUTCDate(d.getUTCDate() + 4 - dayNum)
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
	return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
