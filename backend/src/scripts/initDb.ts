import postgres from 'postgres'
import dotenv from 'dotenv'

/**
 * 数据库初始化脚本
 * 设计意图: 一键初始化数据库表结构
 */
dotenv.config()

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
	console.error('错误: DATABASE_URL 环境变量未设置')
	process.exit(1)
}

async function initDb() {
	console.log('正在连接数据库...')
	
	const client = postgres(connectionString, { prepare: false })
	
	try {
		console.log('创建 weeks 表...')
		await client`
			CREATE TABLE IF NOT EXISTS weeks (
				id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				year INTEGER NOT NULL,
				week_number INTEGER NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
				UNIQUE(year, week_number)
			)
		`
		
		console.log('创建 cards 表...')
		await client`
			CREATE TABLE IF NOT EXISTS cards (
				id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				week_id UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
				day_of_week TEXT NOT NULL CHECK (day_of_week IN ('MON', 'TUE', 'WED', 'THU', 'FRI', 'WEEKEND')),
				image_url TEXT NOT NULL,
				image_path TEXT NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
			)
		`
		
		console.log('创建 terms 表...')
		await client`
			CREATE TABLE IF NOT EXISTS terms (
				id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
				text TEXT NOT NULL,
				is_ai_generated BOOLEAN DEFAULT FALSE NOT NULL,
				order_index INTEGER DEFAULT 0 NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
			)
		`
		
		console.log('创建索引...')
		await client`CREATE INDEX IF NOT EXISTS week_day_idx ON cards(week_id, day_of_week)`
		await client`CREATE INDEX IF NOT EXISTS card_idx ON terms(card_id)`
		
		console.log('✅ 数据库初始化完成!')
	} catch (err) {
		console.error('❌ 初始化失败:', err)
		process.exit(1)
	} finally {
		await client.end()
	}
}

initDb()
