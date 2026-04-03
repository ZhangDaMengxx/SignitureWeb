import { useState, useCallback } from 'react'
import { cardApi, termApi } from '../lib/api'
import type { Card, Term } from '../types'

/**
 * 卡片数据管理 Hook
 * 设计意图: 封装卡片的上传、删除和术语生成
 */
export function useCards() {
	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	/**
	 * 上传图片并生成术语
	 */
	const uploadCard = useCallback(async (
		file: File,
		weekId: string,
		dayOfWeek: string,
		generateTerms = true
	): Promise<Card | null> => {
		setUploading(true)
		setError(null)
		
		try {
			// 1. 上传图片
			const formData = new FormData()
			formData.append('image', file)
			formData.append('weekId', weekId)
			formData.append('dayOfWeek', dayOfWeek)
			
			const card = await cardApi.create(formData)
			
			// 2. 生成术语（如果使用AI）
			if (generateTerms) {
				// 读取文件为 base64
				const base64 = await fileToBase64(file)
				const terms = await generateTermsFromImage(base64, file.type)
				
				if (terms.length > 0) {
					await termApi.createBatch(card.id, terms)
				}
			}
			
			return card
		} catch (err) {
			setError(err instanceof Error ? err.message : '上传失败')
			return null
		} finally {
			setUploading(false)
		}
	}, [])

	/**
	 * 删除卡片
	 */
	const deleteCard = useCallback(async (id: string): Promise<boolean> => {
		try {
			await cardApi.delete(id)
			return true
		} catch (err) {
			setError(err instanceof Error ? err.message : '删除失败')
			return false
		}
	}, [])

	return {
		uploading,
		error,
		uploadCard,
		deleteCard,
	}
}

/**
 * 文件转 Base64
 */
function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			const result = reader.result as string
			// 移除 data:image/xxx;base64, 前缀
			const base64 = result.split(',')[1]
			resolve(base64)
		}
		reader.onerror = reject
		reader.readAsDataURL(file)
	})
}

/**
 * 调用 Gemini API 生成术语
 */
async function generateTermsFromImage(
	base64: string,
	mimeType: string
): Promise<string[]> {
	const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
	
	try {
		const response = await fetch(`${API_URL}/api/ai/generate-terms`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ imageBase64: base64, mimeType }),
		})
		
		if (!response.ok) return []
		const data = await response.json()
		return data.terms || []
	} catch {
		return []
	}
}
