import { WeekView } from './components/WeekView'

/**
 * 主应用组件
 * 设计意图: 作为应用的根容器，提供主题和全局状态
 */
function App() {
	return (
		<div className="min-h-screen bg-amber-50 dark:bg-amber-950 transition-colors duration-300">
			<header className="py-6 px-4 text-center border-b border-amber-200 dark:border-amber-800">
				<h1 className="text-4xl font-hand font-bold text-amber-900 dark:text-amber-100">
					设计术语灵感剪切板
				</h1>
				<p className="mt-2 text-amber-700 dark:text-amber-300 font-hand text-lg">
					记录每一份设计灵感
				</p>
			</header>
			<main className="container mx-auto px-4 py-6">
				<WeekView />
			</main>
		</div>
	)
}

export default App
