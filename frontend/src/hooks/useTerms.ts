import { useState, useCallback } from 'react'
import { termApi } from '../lib/api'
import type { Term } from '../types'

/**
 * 术语标签管理 Hook
 * 设计意图: 封装术语的增删改查和本地状态管理
 */
export function useTerms(cardId: string) {
	const [terms, setTerms] = useState<Term[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	/**
	 * 加载术语列表
	 */
	const loadTerms = useCallback(async () => {
		if (!cardId) return
		
		setLoading(true)
		setError(null)
		try {
			const data = await termApi.getByCard(cardId)
			setTerms(data)
		} catch (err) {
			setError(err instanceof Error ? err.message : '加载失败')
		} finally {
			setLoading(false)
		}
	}, [cardId])

	/**
	 * 添加术语
	 */
	const addTerm = useCallback(async (text: string): Promise<boolean> => {
		if (!cardId || !text.trim()) return false
		
		try {
			const term = await termApi.create(cardId, text.trim())
			setTerms(prev => [...prev, term])
			return true
		} catch (err) {
			setError(err instanceof Error ? err.message : '添加失败')
			return false
		}
	}, [cardId])

	/**
	 * 更新术语
	 */
	const updateTerm = useCallback(async (id: string, text: string): Promise<boolean> => {
		if (!text.trim()) return false
		
		try {
			const term = await termApi.update(id, text.trim())
			setTerms(prev => prev.map(t => t.id === id ? term : t))
			return true
		} catch (err) {
			setError(err instanceof Error ? err.message : '更新失败')
			return false
		}
	}, [])

	/**
	 * 删除术语
	 */
	const deleteTerm = useCallback(async (id: string): Promise<boolean> => {
		try {
			await termApi.delete(id)
			setTerms(prev => prev.filter(t => t.id !== id))
			return true
		} catch (err) {
			setError(err instanceof Error ? err.message : '删除失败')
			return false
		}
	}, [])

	/**
	 * 批量添加术语（AI生成）
	 */
	const addBatchTerms = useCallback(async (termList: string[]): Promise<boolean> => {
		if (!cardId || termList.length === 0) return false
		
		try {
			const newTerms = await termApi.createBatch(cardId, termList)
			setTerms(prev => [...prev, ...newTerms])
			return true
		} catch (err) {
			setError(err instanceof Error ? err.message : '批量添加失败')
			return false
		}
	}, [cardId])

	return {
		terms,
		loading,
		error,
		loadTerms,
		addTerm,
		updateTerm,
		deleteTerm,
		addBatchTerms,
		setTerms, // 允许直接设置，用于本地更新
	}
}
