import { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { PolaroidCard } from './PolaroidCard'
import type { DayOfWeek, Card } from '../types'

interface DayCellProps {
	day: DayOfWeek
	isWeekend?: boolean
}

const DAY_LABELS: Record<DayOfWeek, string> = {
	MON: '周一',
	TUE: '周二',
	WED: '周三',
	THU: '周四',
	FRI: '周五',
	WEEKEND: '周末',
}

/**
 * 日期格子组件
 * 设计意图: 作为卡片的容器，支持拖拽上传
 */
export function DayCell({ day, isWeekend }: DayCellProps) {
	const [cards, setCards] = useState<Card[]>([])
	const [isDragging, setIsDragging] = useState(false)

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(true)
	}, [])

	const handleDragLeave = useCallback(() => {
		setIsDragging(false)
	}, [])

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)
		// TODO: 处理文件上传
	}, [])

	const baseClasses = `
		relative min-h-[200px] rounded-xl p-4
		transition-all duration-300
		shadow-polaroid paper-texture
	`

	const stateClasses = isDragging
		? 'bg-amber-200/50 dark:bg-amber-800/50 border-2 border-dashed border-amber-400'
		: isWeekend
			? 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30'
			: 'bg-white dark:bg-amber-900/20'

	return (
		<div
			className={`${baseClasses} ${stateClasses}`}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			{/* 日期标签 */}
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-lg font-hand font-bold text-amber-800 dark:text-amber-200">
					{DAY_LABELS[day]}
				</h3>
				<button
					className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-800/50 
						hover:bg-amber-200 dark:hover:bg-amber-700/50 transition-colors"
					aria-label={`添加${DAY_LABELS[day]}的灵感`}
				>
					<Plus className="w-4 h-4 text-amber-600 dark:text-amber-300" />
				</button>
			</div>

			{/* 卡片列表 */}
			<div className="flex flex-wrap gap-3">
				{cards.map(card => (
					<PolaroidCard key={card.id} card={card} />
				))}
			</div>

			{/* 空状态提示 */}
			{cards.length === 0 && !isDragging && (
				<p className="text-center text-amber-400/60 dark:text-amber-600/40 
					font-hand text-sm mt-8">
					拖放图片或点击添加
				</p>
			)}

			{/* 装饰胶带 */}
			<div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-6 
				tape opacity-60" />
		</div>
	)
}
