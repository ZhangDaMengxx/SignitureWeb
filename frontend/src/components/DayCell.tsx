import { useState, useCallback, useRef } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PolaroidCard } from './PolaroidCard'
import { WashiTape, PushPin } from './WashiTape'
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

const TAPE_COLORS = ['pink', 'blue', 'yellow', 'green', 'white'] as const

/**
 * 日期格子组件
 * 设计意图: 拟物化纸张效果，支持拖拽和点击上传
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

		const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
		if (!allowedTypes.includes(file.type)) {
			alert('请上传图片文件 (JPG, PNG, GIF, WEBP)')
			return
		}

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
		e.target.value = ''
	}

	const tapeColor = TAPE_COLORS[day.charCodeAt(0) % TAPE_COLORS.length]

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className={`
				relative min-h-[220px] rounded-lg p-4
				transition-all duration-300
				${isDragging
					? 'ring-2 ring-dashed ring-amber-400 bg-amber-100/50 dark:bg-amber-800/50'
					: isWeekend
						? 'bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-900/20 dark:to-amber-900/20'
						: 'bg-white/80 dark:bg-amber-900/20'
				}
			`}
			style={{
				boxShadow: `
					0 1px 2px rgba(0,0,0,0.05),
					0 4px 8px rgba(0,0,0,0.05),
					inset 0 1px 0 rgba(255,255,255,0.8)
				`,
			}}
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
				aria-hidden="true"
			/>

			{/* 纸胶带装饰 */}
			<WashiTape 
				color={tapeColor}
				rotation={-3 + Math.random() * 2}
				className="-top-2 left-1/2 -translate-x-1/2 w-20"
				variant={Math.random() > 0.5 ? 'striped' : 'solid'}
			/>

			{/* 图钉装饰 */}
			<PushPin 
				color={isWeekend ? 'blue' : 'red'}
				className="top-2 right-3"
			/>

			{/* 日期标签 */}
			<div className="flex items-center justify-between mb-4 pt-2">
				<h3 className="text-xl font-hand font-bold text-amber-800 dark:text-amber-200
					tracking-wide">
					{DAY_LABELS[day]}
				</h3>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => fileInputRef.current?.click()}
					disabled={uploading || !weekId}
					className="p-2 rounded-full bg-amber-100/80 dark:bg-amber-800/50 
						hover:bg-amber-200 dark:hover:bg-amber-700/50 
						transition-colors disabled:opacity-50 shadow-sm"
					aria-label={`添加${DAY_LABELS[day]}的灵感`}
				>
					{uploading ? (
						<Loader2 className="w-4 h-4 text-amber-600 dark:text-amber-300 animate-spin" />
					) : (
						<Plus className="w-4 h-4 text-amber-600 dark:text-amber-300" />
					)}
				</motion.button>
			</div>

			{/* 错误提示 */}
			<AnimatePresence>
				{error && (
					<motion.p 
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						className="text-xs text-red-500 mb-2 bg-red-50/50 rounded px-2 py-1"
					>
						{error}
					</motion.p>
				)}
			</AnimatePresence>

			{/* 卡片列表 */}
			<div className="flex flex-wrap gap-3 justify-center">
				<AnimatePresence>
					{cards.map((card, index) => (
						<motion.div
							key={card.id}
							initial={{ opacity: 0, scale: 0.8, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ delay: index * 0.1 }}
							layout
						>
							<PolaroidCard card={card} />
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			{/* 空状态提示 */}
			{cards.length === 0 && !isDragging && (
				<motion.div 
					initial={{ opacity: 0 }}
					animate={{ opacity: isHovering ? 0.8 : 0.4 }}
					className="flex flex-col items-center justify-center py-8"
				>
					<div className="w-16 h-16 rounded-full bg-amber-100/50 
						dark:bg-amber-800/30 flex items-center justify-center mb-2">
						<span className="text-3xl">🖼️</span>
					</div>
					<p className="text-center text-amber-500/70 dark:text-amber-400/50 
						font-hand text-sm">
						拖放图片或点击添加
					</p>
				</motion.div>
			)}

			{/* 拖放提示 */}
			<AnimatePresence>
				{isDragging && (
					<motion.div 
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 flex items-center justify-center 
							bg-amber-200/30 dark:bg-amber-800/30 rounded-lg backdrop-blur-sm"
					>
						<div className="text-center">
							<span className="text-4xl mb-2 block">📥</span>
							<p className="text-amber-700 dark:text-amber-300 font-hand text-lg">
								松开以上传
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}
