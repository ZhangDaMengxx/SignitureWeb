import { WeekView } from './components/WeekView'
import { ThemeToggle } from './components/ThemeToggle'

/**
 * 主应用组件
 * 设计意图: 作为应用的根容器，提供主题和全局布局
 */
function App() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-100/50 
			dark:from-amber-950 dark:via-amber-900/20 dark:to-amber-950 
			transition-colors duration-500">
			{/* 背景装饰 - 拟物化纸张纹理 */}
			<div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-10"
				style={{
					backgroundImage: `
						linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px),
						linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)
					`,
					backgroundSize: '20px 20px'
				}}
			/>

			{/* 头部 */}
			<header className="relative py-6 px-4 text-center border-b 
				border-amber-200/50 dark:border-amber-800/30 
				bg-white/30 dark:bg-amber-950/30 backdrop-blur-sm">
				<div className="absolute top-4 right-4">
					<ThemeToggle />
				</div>

				{/* 装饰图钉 */}
				<div className="absolute top-4 left-8 w-4 h-4 
					rounded-full bg-red-400/80 shadow-sm" />
				<div className="absolute top-4 right-8 w-4 h-4 
					rounded-full bg-blue-400/80 shadow-sm" />

				<h1 className="text-4xl md:text-5xl font-hand font-bold 
					text-amber-900 dark:text-amber-100
					drop-shadow-sm">
					设计术语灵感剪切板
				</h1>
				<p className="mt-3 text-amber-700 dark:text-amber-300 
					font-hand text-lg md:text-xl">
					记录每一份设计灵感 · 自动提取专业术语
				</p>
			</header>

			{/* 主内容区 */}
			<main className="relative container mx-auto px-4 py-8 max-w-6xl">
				<WeekView />
			</main>

			{/* 底部 */}
			<footer className="relative py-6 text-center text-amber-600/60 
				dark:text-amber-400/40 font-hand text-sm">
				<p>拖拽图片到任意日期格子 · AI自动生成设计术语</p>
			</footer>
		</div>
	)
}

export default App
