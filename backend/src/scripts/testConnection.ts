import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config()

/**
 * 测试数据库连接
 */
async function main() {
	const connectionString = process.env.DATABASE_URL
	
	if (!connectionString) {
		console.error('错误: DATABASE_URL 环境变量未设置')
		process.exit(1)
	}
	
	console.log('测试数据库连接...')
	const client = postgres(connectionString, { prepare: false })
	
	try {
		const result = await client`SELECT 1`
		if (result.length > 0) {
			console.log('✅ 数据库连接成功!')
		}
	} catch (err) {
		console.error('❌ 数据库连接失败:', err)
		process.exit(1)
	} finally {
		await client.end()
	}
}

main()
