import { useState, useEffect, useCallback } from 'react'
import { weekApi } from '../lib/api'
import type { Week } from '../types'

/**
 * 周数据管理 Hook
 * 设计意图: 封装周的获取、创建和状态管理
 */
export function useWeeks() {
	const [weeks, setWeeks] = useState<Week[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchWeeks = useCallback(async () => {
		setLoading(true)
		setError(null)
		try {
			const data = await weekApi.getAll()
			setWeeks(data)
		} catch (err) {
			setError(err instanceof Error ? err.message : '获取失败')
		} finally {
			setLoading(false)
		}
	}, [])

	const getOrCreateWeek = useCallback(async (year: number, weekNumber: number) => {
		try {
			// 先尝试获取
			const week = await weekApi.getByNumber(year, weekNumber)
			return week
		} catch {
			// 不存在则创建
			return weekApi.create(year, weekNumber)
		}
	}, [])

	useEffect(() => {
		fetchWeeks()
	}, [fetchWeeks])

	return {
		weeks,
		loading,
		error,
		refresh: fetchWeeks,
		getOrCreateWeek,
	}
}
