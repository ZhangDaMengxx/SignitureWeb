import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.js'

/**
 * 数据库连接配置
 * 设计意图: 使用连接池管理数据库连接
 */
const connectionString = process.env.DATABASE_URL || 
	`postgres://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'password'}@` +
	`${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'design_inspiration'}`

/**
 * 创建数据库客户端
 */
const client = postgres(connectionString, {
	max: 10, // 连接池大小
	idle_timeout: 20, // 空闲超时(秒)
	connect_timeout: 10, // 连接超时(秒)
})

/**
 * Drizzle ORM 实例
 */
export const db = drizzle(client, { schema })

/**
 * 关闭数据库连接
 */
export async function closeDb(): Promise<void> {
	await client.end()
}
