import type { Week, Card, Term, DayOfWeek } from '../types'

/**
 * API 基础配置
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

/**
 * 通用请求封装
 * 设计意图: 统一处理错误和响应格式
 */
async function request<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const response = await fetch(`${API_BASE}${endpoint}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
		},
	})
	
	if (!response.ok) {
		const error = await response.json().catch(() => ({}))
		throw new Error(error.error || `请求失败: ${response.status}`)
	}
	
	return response.json()
}

/**
 * 周相关 API
 */
export const weekApi = {
	getAll: () => request<Week[]>('/weeks'),
	
	getByNumber: (year: number, weekNumber: number) =>
		request<Week>(`/weeks/${year}/${weekNumber}`),
	
	create: (year: number, weekNumber: number) =>
		request<Week>('/weeks', {
			method: 'POST',
			body: JSON.stringify({ year, weekNumber }),
		}),
}

/**
 * 卡片相关 API
 */
export const cardApi = {
	getAll: () => request<Card[]>('/cards'),
	
	getById: (id: string) => request<Card>(`/cards/${id}`),
	
	create: (formData: FormData) =>
		fetch(`${API_BASE}/cards`, {
			method: 'POST',
			body: formData,
		}).then(r => {
			if (!r.ok) throw new Error('上传失败')
			return r.json() as Promise<Card>
		}),
	
	delete: (id: string) =>
		request<void>(`/cards/${id}`, { method: 'DELETE' }),
}

/**
 * 术语相关 API
 */
export const termApi = {
	getByCard: (cardId: string) =>
		request<Term[]>(`/terms?cardId=${cardId}`),
	
	create: (cardId: string, text: string, isAiGenerated = false) =>
		request<Term>('/terms', {
			method: 'POST',
			body: JSON.stringify({ cardId, text, isAiGenerated }),
		}),
	
	createBatch: (cardId: string, termList: string[]) =>
		request<Term[]>('/terms/batch', {
			method: 'POST',
			body: JSON.stringify({ cardId, termList }),
		}),
	
	update: (id: string, text: string) =>
		request<Term>(`/terms/${id}`, {
			method: 'PUT',
			body: JSON.stringify({ text }),
		}),
	
	delete: (id: string) =>
		request<void>(`/terms/${id}`, { method: 'DELETE' }),
}
