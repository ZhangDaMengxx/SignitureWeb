import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatWeekRange, getWeekNumber } from '../lib/utils'
import { weekApi } from '../lib/api'
import { DayCell } from './DayCell'
import { Notebook } from './Notebook'
import type { DayOfWeek, Week } from '../types'

const DAYS_ROW1: DayOfWeek[] = ['MON', 'TUE', 'WED']
const DAYS_ROW2: DayOfWeek[] = ['THU', 'FRI', 'WEEKEND']

/**
 * 周视图组件
 * 设计意图: 三行手账式布局，支持周导航和数据加载
 */
export function WeekView() {
	const [currentDate, setCurrentDate] = useState(new Date())
	const [notebookHeight, setNotebookHeight] = useState(200)
	const [week, setWeek] = useState<Week | null>(null)
	const [loading, setLoading] = useState(false)

	const year = currentDate.getFullYear()
	const weekNumber = getWeekNumber(currentDate)
	const weekRange = formatWeekRange(currentDate)

	// 加载周数据
	useEffect(() => {
		const loadWeek = async () => {
			setLoading(true)
			try {
				// 获取或创建周记录
				const weekData = await weekApi.getByNumber(year, weekNumber)
				setWeek(weekData)
			} catch {
				// 不存在则创建
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

	const prevWeek = () => {
		const d = new Date(currentDate)
		d.setDate(d.getDate() - 7)
		setCurrentDate(d)
	}

	const nextWeek = () => {
		const d = new Date(currentDate)
		d.setDate(d.getDate() + 7)
		setCurrentDate(d)
	}

	// 获取某天的卡片
	const getCardsForDay = (day: DayOfWeek) => {
		return week?.cards.filter(c => c.dayOfWeek === day) || []
	}

	// 刷新周数据
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
		<div className="space-y-6">
			{/* 周导航 */}
			<nav className="flex items-center justify-between bg-white dark:bg-amber-900/20 
				rounded-xl p-4 shadow-polaroid paper-texture">
				<button
					onClick={prevWeek}
					className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-800/50 
						transition-colors"
					aria-label="上一周"
				>
					<ChevronLeft className="w-6 h-6 text-amber-700 dark:text-amber-300" />
				</button>
				
				<div className="text-center">
					<h2 className="text-2xl font-hand font-bold text-amber-900 dark:text-amber-100">
						第 {weekNumber} 周
					</h2>
					<p className="text-amber-600 dark:text-amber-400 font-hand">
						{weekRange}
					</p>
					{loading && (
						<span className="text-xs text-amber-500">加载中...</span>
					)}
				</div>
				
				<button
					onClick={nextWeek}
					className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-800/50 
						transition-colors"
					aria-label="下一周"
				>
					<ChevronRight className="w-6 h-6 text-amber-700 dark:text-amber-300" />
				</button>
			</nav>

			{/* 周网格 - 三行布局 */}
			<div className="space-y-4">
				{/* 第一行: 周一/周二/周三 */}
				<div className="grid grid-cols-3 gap-4">
					{DAYS_ROW1.map(day => (
						<DayCell 
							key={day} 
							day={day} 
							weekId={week?.id}
							cards={getCardsForDay(day)}
							onCardAdded={refreshWeek}
						/>
					))}
				</div>

				{/* 第二行: 周四/周五/周末 */}
				<div className="grid grid-cols-3 gap-4">
					{DAYS_ROW2.map(day => (
						<DayCell 
							key={day} 
							day={day} 
							isWeekend={day === 'WEEKEND'}
							weekId={week?.id}
							cards={getCardsForDay(day)}
							onCardAdded={refreshWeek}
						/>
					))}
				</div>

				{/* 第三行: 全宽笔记本 */}
				<Notebook 
					height={notebookHeight} 
					onHeightChange={setNotebookHeight} 
				/>
			</div>
		</div>
	)
}
