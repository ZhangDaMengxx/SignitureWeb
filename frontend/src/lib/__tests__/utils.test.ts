import { describe, it, expect } from 'vitest'
import { formatWeekRange, getWeekNumber, generateId, cn } from '../utils'

describe('utils', () => {
	describe('cn', () => {
		it('合并类名', () => {
			expect(cn('a', 'b')).toBe('a b')
			expect(cn('a', { b: true, c: false })).toBe('a b')
		})
		
		it('处理Tailwind冲突', () => {
			expect(cn('px-2', 'px-4')).toBe('px-4')
		})
	})
	
	describe('formatWeekRange', () => {
		it('格式化周范围', () => {
			const date = new Date('2026-04-03')
			const result = formatWeekRange(date)
			expect(typeof result).toBe('string')
			expect(result).toContain('-')
		})
	})
	
	describe('getWeekNumber', () => {
		it('计算周数', () => {
			const date = new Date('2026-01-01')
			const weekNum = getWeekNumber(date)
			expect(typeof weekNum).toBe('number')
			expect(weekNum).toBeGreaterThan(0)
			expect(weekNum).toBeLessThanOrEqual(53)
		})
	})
	
	describe('generateId', () => {
		it('生成唯一ID', () => {
			const id1 = generateId()
			const id2 = generateId()
			expect(typeof id1).toBe('string')
			expect(id1).not.toBe(id2)
		})
	})
})
