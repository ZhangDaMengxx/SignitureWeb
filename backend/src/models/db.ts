import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.js'

/**
 * 数据库连接配置
 * 设计意图: 使用 Supabase PostgreSQL，支持连接池
 */
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
	throw new Error('DATABASE_URL 环境变量未设置')
}

/**
 * 创建数据库客户端
 * 使用 Supabase 连接池配置
 */
const client = postgres(connectionString, {
	prepare: false, // Supabase 连接池不支持 prepared statements
	max: 10,
	idle_timeout: 20,
	connect_timeout: 10,
})

/**
 * Drizzle ORM 实例
 */
export const db = drizzle(client, { schema })

/**
 * 测试数据库连接
 */
export async function testConnection(): Promise<boolean> {
	try {
		const result = await client`SELECT 1`
		return result.length > 0
	} catch (err) {
		console.error('数据库连接失败:', err)
		return false
	}
}

/**
 * 关闭数据库连接
 */
export async function closeDb(): Promise<void> {
	await client.end()
}
