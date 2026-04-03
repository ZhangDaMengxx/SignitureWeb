import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Gemini AI 服务
 * 设计意图: 封装图片识别生成设计术语的逻辑
 */
const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
	throw new Error('GEMINI_API_KEY 环境变量未设置')
}

const genAI = new GoogleGenerativeAI(apiKey)

/**
 * 从图片生成设计术语
 * @param imageBase64 - Base64编码的图片
 * @param mimeType - 图片类型
 * @returns 设计术语列表
 */
export async function generateTermsFromImage(
	imageBase64: string,
	mimeType: string
): Promise<string[]> {
	const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
	
	const prompt = `
分析这张设计图片，生成5-10个设计术语关键词。
要求:
1. 术语应该准确描述图片的设计风格、元素或技巧
2. 使用中文术语
3. 返回JSON数组格式，例如: ["极简主义", "负空间", "排版设计"]
4. 只返回JSON数组，不要其他解释
`
	
	const imageData = {
		inlineData: {
			data: imageBase64,
			mimeType,
		},
	}
	
	try {
		const result = await model.generateContent([prompt, imageData])
		const text = result.response.text()
		
		// 解析JSON响应
		const jsonMatch = text.match(/\[[\s\S]*\]/)
		if (jsonMatch) {
			const terms = JSON.parse(jsonMatch[0])
			if (Array.isArray(terms) && terms.length > 0) {
				return terms.slice(0, 10)
			}
		}
		
		// 如果解析失败，返回空数组
		return []
	} catch (err) {
		console.error('Gemini API 调用失败:', err)
		return []
	}
}

/**
 * Mock 生成术语（用于测试）
 */
export function generateMockTerms(): string[] {
	const mockTerms = [
		'极简主义',
		'负空间',
		'排版设计',
		'色彩理论',
		'视觉层次',
		'网格系统',
		'对比度',
		'品牌识别',
		'用户体验',
		'扁平化设计',
	]
	
	// 随机返回5-8个
	const count = Math.floor(Math.random() * 4) + 5
	return mockTerms.slice(0, count)
}
