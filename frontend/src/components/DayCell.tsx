import { useState, useCallback, useRef } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PolaroidCard } from './PolaroidCard'
import { useCards } from '../hooks/useCards'
import type { DayOfWeek, Card } from '../types'

interface DayCellProps {
	day: DayOfWeek
	isWeekend?: boolean
	weekId?: string
	cards: Card[]
	onCardAdded?: () => void
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
 * 设计意图: 作为卡片的容器，支持拖拽和点击上传
 */
export function DayCell({ day, isWeekend, weekId, cards, onCardAdded }: DayCellProps) {
	const [isDragging, setIsDragging] = useState(false)
	const [isHovering, setIsHovering] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { uploadCard, uploading, error } = useCards()

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(true)
	}, [])

	const handleDragLeave = useCallback(() => {
		setIsDragging(false)
	}, [])

	const processFile = async (file: File) => {
		if (!weekId) return

		// 验证文件类型
		const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
		if (!allowedTypes.includes(file.type)) {
			alert('请上传图片文件 (JPG, PNG, GIF, WEBP)')
			return
		}

		// 验证文件大小 (10MB)
		if (file.size > 10 * 1024 * 1024) {
			alert('文件大小不能超过 10MB')
			return
		}

		const card = await uploadCard(file, weekId, day, true)
		if (card && onCardAdded) {
			onCardAdded()
		}
	}

	const handleDrop = useCallback(async (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)

		const files = e.dataTransfer.files
		if (files.length > 0) {
			await processFile(files[0])
		}
	}, [weekId, day, uploadCard, onCardAdded])

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (files && files.length > 0) {
			await processFile(files[0])
		}
		// 重置 input 以便可以重复选择同一文件
		e.target.value = ''
	}

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
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
		>
			{/* 隐藏的文件输入 */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileSelect}
				className="hidden"
			/aria-hidden="true"
			/>

			{/* 日期标签 */}
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-lg font-hand font-bold text-amber-800 dark:text-amber-200">
					{DAY_LABELS[day]}
				</h3>
				<button
					onClick={() => fileInputRef.current?.click()}
					disabled={uploading || !weekId}
					className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-800/50 
						hover:bg-amber-200 dark:hover:bg-amber-700/50 
						transition-colors disabled:opacity-50"
					aria-label={`添加${DAY_LABELS[day]}的灵感`}
				>
					{uploading ? (
						<Loader2 className="w-4 h-4 text-amber-600 dark:text-amber-300 animate-spin" />
					) : (
						<Plus className="w-4 h-4 text-amber-600 dark:text-amber-300" />
					)}
				</button>
			</div>

			{/* 错误提示 */}
			{error && (
				<p className="text-xs text-red-500 mb-2">{error}</p>
			)}

			{/* 卡片列表 */}
			<div className="flex flex-wrap gap-3">
				<AnimatePresence>
					{cards.map(card => (
						<motion.div
							key={card.id}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							layout
						>
							<PolaroidCard card={card} />
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			{/* 空状态提示 */}
			{cards.length === 0 && !isDragging && (
				<motion.p 
					initial={{ opacity: 0 }}
					animate={{ opacity: isHovering ? 1 : 0.6 }}
					className="text-center text-amber-400/60 dark:text-amber-600/40 
						font-hand text-sm mt-8"
				>
					拖放图片或点击添加
				</motion.p>
			)}

			{/* 拖放提示 */}
			{isDragging && (
				<div className="absolute inset-0 flex items-center justify-center">
					<p className="text-amber-600 dark:text-amber-300 font-hand text-lg">
						松开以上传
					</p>
				</div>
			)}

			{/* 装饰胶带 */}
			<div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-6 
				tape opacity-60" />
		</div>
	)
}
