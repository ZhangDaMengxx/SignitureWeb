import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatWeekRange, getWeekNumber } from '../lib/utils'
import { weekApi } from '../lib/api'
import { DayCell } from './DayCell'
import { Notebook } from './Notebook'
import { WashiTape, PushPin } from './WashiTape'
import type { DayOfWeek, Week } from '../types'

const DAYS_ROW1: DayOfWeek[] = ['MON', 'TUE', 'WED']
const DAYS_ROW2: DayOfWeek[] = ['THU', 'FRI', 'WEEKEND']

/**
 * 周视图组件
 * 设计意图: 三行手账式布局，拟物化风格
 */
export function WeekView() {
	const [currentDate, setCurrentDate] = useState(new Date())
	const [notebookHeight, setNotebookHeight] = useState(250)
	const [week, setWeek] = useState<Week | null>(null)
	const [loading, setLoading] = useState(false)
	const [direction, setDirection] = useState(0)

	const year = currentDate.getFullYear()
	const weekNumber = getWeekNumber(currentDate)
	const weekRange = formatWeekRange(currentDate)

	useEffect(() => {
		const loadWeek = async () => {
			setLoading(true)
			try {
				const weekData = await weekApi.getByNumber(year, weekNumber)
				setWeek(weekData)
			} catch {
				try {
					const newWeek = await weekApi.create(year, weekNumber)
					setWeek(newWeek)
				} catch (err) {
					console.error('创建周失败:', err)
				}
			} finally {
				setLoading(false)
			}
		}

		loadWeek()
	}, [year, weekNumber])

	const navigate = (delta: number) => {
		setDirection(delta)
		const d = new Date(currentDate)
		d.setDate(d.getDate() + delta * 7)
		setCurrentDate(d)
	}

	const getCardsForDay = (day: DayOfWeek) => {
		return week?.cards.filter(c => c.dayOfWeek === day) || []
	}

	const refreshWeek = async () => {
		if (!week) return
		try {
			const updated = await weekApi.getByNumber(year, weekNumber)
			setWeek(updated)
		} catch (err) {
			console.error('刷新失败:', err)
		}
	}

	return (
		<div className="space-y-8">
			{/* 周导航 - 拟物化风格 */}
			<motion.nav 
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="relative bg-white/70 dark:bg-amber-900/20 
					rounded-xl p-5 backdrop-blur-sm"
				style={{
					boxShadow: `
						0 2px 4px rgba(0,0,0,0.05),
						0 8px 16px rgba(0,0,0,0.05),
						inset 0 1px 0 rgba(255,255,255,0.8)
					`,
				}}
			>
				{/* 装饰胶带 */}
				<WashiTape 
					color="pink"
					rotation={-2}
					className="-top-2 left-8 w-16"
				/>
				<WashiTape 
					color="blue"
					rotation={2}
					className="-top-2 right-8 w-16"
				/>

				{/* 左侧导航 */}
				<motion.button
					whileHover={{ scale: 1.1, x: -3 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => navigate(-1)}
					className="absolute left-4 top-1/2 -translate-y-1/2 
						p-3 rounded-full bg-amber-100/80 dark:bg-amber-800/40 
						hover:bg-amber-200 dark:hover:bg-amber-700/50 
						transition-colors shadow-sm"
					aria-label="上一周"
				>
					<ChevronLeft className="w-6 h-6 text-amber-700 dark:text-amber-300" />
				</motion.button>
				
				{/* 中间内容 */}
				<div className="text-center px-16">
					<AnimatePresence mode="wait" custom={direction}>
						<motion.div
							key={`${year}-${weekNumber}`}
							custom={direction}
							initial={{ opacity: 0, x: direction * 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: direction * -20 }}
							transition={{ duration: 0.2 }}
						>
							<div className="flex items-center justify-center gap-2 mb-1">
								<Sparkles className="w-5 h-5 text-amber-400" />
								<h2 className="text-3xl font-hand font-bold 
									text-amber-900 dark:text-amber-100">
									第 {weekNumber} 周
								</h2>
								<Sparkles className="w-5 h-5 text-amber-400" />
							</div>
							<p className="text-amber-600 dark:text-amber-400 
								font-hand text-lg">
								{weekRange}
							</p>
							{loading && (
								<motion.span 
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="text-xs text-amber-500 inline-flex 
										items-center gap-1 mt-1"
								>
									<span className="w-3 h-3 border border-amber-400 
										border-t-transparent rounded-full animate-spin" />
									加载中...
								</motion.span>
							)}
						</motion.div>
					</AnimatePresence>
				</div>
				
				{/* 右侧导航 */}
				<motion.button
					whileHover={{ scale: 1.1, x: 3 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => navigate(1)}
					className="absolute right-4 top-1/2 -translate-y-1/2 
						p-3 rounded-full bg-amber-100/80 dark:bg-amber-800/40 
						hover:bg-amber-200 dark:hover:bg-amber-700/50 
						transition-colors shadow-sm"
					aria-label="下一周"
				>
					<ChevronRight className="w-6 h-6 text-amber-700 dark:text-amber-300" />
				</motion.button>

				{/* 底部装饰图钉 */}
				<PushPin color="yellow" className="bottom-2 left-1/4" />
				<PushPin color="green" className="bottom-2 right-1/4" />
			</motion.nav>

			{/* 周网格 - 三行布局 */}
			<div className="space-y-6">
				{/* 第一行: 周一/周二/周三 */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{DAYS_ROW1.map((day, index) => (
						<motion.div
							key={day}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
						>
							<DayCell 
								day={day} 
								weekId={week?.id}
								cards={getCardsForDay(day)}
								onCardAdded={refreshWeek}
							/>
						</motion.div>
					))}
				</div>

				{/* 第二行: 周四/周五/周末 */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{DAYS_ROW2.map((day, index) => (
						<motion.div
							key={day}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 + index * 0.1 }}
						>
							<DayCell 
								day={day} 
								isWeekend={day === 'WEEKEND'}
								weekId={week?.id}
								cards={getCardsForDay(day)}
								onCardAdded={refreshWeek}
							/>
						</motion.div>
					))}
				</div>

				{/* 第三行: 全宽笔记本 */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
				>
					<Notebook 
						height={notebookHeight} 
						onHeightChange={setNotebookHeight} 
					/>
				</motion.div>
			</div>
		</div>
	)
}
