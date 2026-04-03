import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

/**
 * 允许的图片格式
 */
const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

/**
 * 最大文件大小: 10MB
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * 存储配置
 * 设计意图: 使用UUID重命名文件，防止文件名冲突和路径遍历攻击
 */
const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, 'uploads/')
	},
	filename: (_req, file, cb) => {
		const uniqueName = `${uuidv4()}${path.extname(file.originalname).toLowerCase()}`
		cb(null, uniqueName)
	},
})

/**
 * 文件过滤器
 * 设计意图: 验证文件类型，防止上传可执行文件
 */
const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
	if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
		cb(null, true)
	} else {
		cb(new Error(`不支持的文件类型: ${file.mimetype}. 仅支持 JPG, PNG, GIF, WEBP`))
	}
}

/**
 * 上传中间件实例
 */
export const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: MAX_FILE_SIZE,
		files: 1,
	},
})
