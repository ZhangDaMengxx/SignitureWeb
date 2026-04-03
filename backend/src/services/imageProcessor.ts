import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'

/**
 * 图片处理配置
 */
const MAX_WIDTH = 1200
const MAX_HEIGHT = 1200
const QUALITY = 80

/**
 * 处理上传的图片
 * 设计意图: 压缩图片、生成缩略图、优化存储
 */
export async function processUploadedImage(inputPath: string): Promise<{
	originalSize: number
	processedSize: number
	compressionRatio: number
}> {
	const outputPath = inputPath.replace(/\.[^.]+$/, '_optimized.webp')

	try {
		// 获取原始文件大小
		const originalStats = await fs.stat(inputPath)
		const originalSize = originalStats.size

		// 使用 sharp 处理图片
		await sharp(inputPath)
			.resize(MAX_WIDTH, MAX_HEIGHT, {
				fit: 'inside',
				withoutEnlargement: true,
			})
			.webp({
				quality: QUALITY,
				effort: 4,
			})
			.toFile(outputPath)

		// 获取处理后大小
		const processedStats = await fs.stat(outputPath)
		const processedSize = processedStats.size

		// 删除原文件
		await fs.unlink(inputPath)

		// 重命名优化后的文件为原文件名
		await fs.rename(outputPath, inputPath.replace(/\.[^.]+$/, '.webp'))

		return {
			originalSize,
			processedSize,
			compressionRatio: Math.round((1 - processedSize / originalSize) * 100),
		}
	} catch (err) {
		// 处理失败时清理临时文件
		try {
			await fs.unlink(outputPath)
		} catch {
			// 忽略清理错误
		}
		throw err
	}
}

/**
 * 生成缩略图
 */
export async function generateThumbnail(
	inputPath: string,
	width: number = 200
): Promise<string> {
	const ext = path.extname(inputPath)
	const baseName = inputPath.slice(0, -ext.length)
	const thumbnailPath = `${baseName}_thumb.webp`

	await sharp(inputPath)
		.resize(width, null, {
			fit: 'inside',
			withoutEnlargement: true,
		})
		.webp({ quality: 60 })
		.toFile(thumbnailPath)

	return thumbnailPath
}

/**
 * 获取图片尺寸
 */
export async function getImageDimensions(
	inputPath: string
): Promise<{ width: number; height: number }> {
	const metadata = await sharp(inputPath).metadata()
	return {
		width: metadata.width || 0,
		height: metadata.height || 0,
	}
}

/**
 * 验证图片文件
 */
export async function validateImageFile(filePath: string): Promise<boolean> {
	try {
		const metadata = await sharp(filePath).metadata()
		return !!metadata.format
	} catch {
		return false
	}
}
