import { useState, useCallback, useRef, useEffect } from 'react'
import { GripHorizontal, Save, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { WashiTape, PushPin } from './WashiTape'

interface NotebookProps {
	height: number
	onHeightChange: (height: number) => void
}

const MIN_HEIGHT = 150
const MAX_HEIGHT = 500

/**
 * 笔记本区域组件
 * 设计意图: 拟物化笔记本效果，可拖拽调整高度，持久化存储
 */
export function Notebook({ height, onHeightChange }: NotebookProps) {
	const [isDragging, setIsDragging] = useState(false)
	const [content, setContent] = useState('')
	const [saved, setSaved] = useState(false)
	const dragStartY = useRef(0)
	const dragStartHeight = useRef(0)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	// 从 localStorage 加载笔记
	useEffect(() => {
		const weekKey = getWeekKey()
		const saved = localStorage.getItem(`notebook-${weekKey}`)
		if (saved) {
			setContent(saved)
		}
	}, [])

	// 自动保存
	useEffect(() => {
		const timer = setTimeout(() => {
			if (content) {
				const weekKey = getWeekKey()
				localStorage.setItem(`notebook-${weekKey}`, content)
				setSaved(true)
				setTimeout(() => setSaved(false), 1500)
			}
		}, 1000)

		return () => clearTimeout(timer)
	}, [content])

	const getWeekKey = () => {
		const now = new Date()
		return `${now.getFullYear()}-W${getWeekNumber(now)}`
	}

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		setIsDragging(true)
		dragStartY.current = e.clientY
		dragStartHeight.current = height
	}, [height])

	const handleMouseMove = useCallback((e: React.MouseEvent) => {
		if (!isDragging) return
		const delta = e.clientY - dragStartY.current
		const newHeight = Math.max(
			MIN_HEIGHT,
			Math.min(MAX_HEIGHT, dragStartHeight.current + delta)
		)
		onHeightChange(newHeight)
	}, [isDragging, onHeightChange])

	const handleMouseUp = useCallback(() => {
		setIsDragging(false)
	}, [])

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="relative bg-white/80 dark:bg-amber-900/20 
				rounded-lg overflow-hidden backdrop-blur-sm"
			style={{ 
				height,
				boxShadow: `
					0 2px 4px rgba(0,0,0,0.05),
					0 8px 16px rgba(0,0,0,0.05),
					inset 0 1px 0 rgba(255,255,255,0.8)
				`,
			}}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseUp}
		>
			{/* 装饰胶带 */}
			<WashiTape 
				color="yellow"
				rotation={-2}
				className="-top-2 left-1/2 -translate-x-1/2 w-20"
			/>
			<PushPin color="blue" className="top-2 left-4" />

			{/* 拖拽手柄 */}
			<div
				onMouseDown={handleMouseDown}
				className={`
					absolute top-0 left-0 right-0 h-8 z-20
					flex items-center justify-center gap-2
					cursor-ns-resize select-none
					transition-colors
					${isDragging 
						? 'bg-amber-200/50 dark:bg-amber-800/50' 
						: 'hover:bg-amber-100/30 dark:hover:bg-amber-800/20'
					}
				`}
			>
				<div className="flex items-center gap-1 text-amber-400/60">
					<GripHorizontal className="w-5 h-5" />
					<span className="text-xs font-hand">拖拽调整高度</span>
				</div>
			</div>

			{/* 笔记本内容 */}
			<div className="pt-10 pb-4 px-6 h-full flex">
				{/* 左侧装订线 */}
				<div className="w-8 flex-shrink-0 flex flex-col items-center gap-4 pt-2">
					{[...Array(5)].map((_, i) => (
						<div 
							key={i}
							className="w-4 h-4 rounded-full bg-gradient-to-br 
								from-slate-300 to-slate-400 shadow-inner"
						/>
					))}
				</div>

				{/* 文本区域 */}
				<div className="flex-1 relative">
					{/* 标题 */}
					<div className="flex items-center justify-between mb-3">
						<h3 className="text-xl font-hand font-bold text-amber-800 
							dark:text-amber-200 flex items-center gap-2">
							<span>📝</span>
							笔记
						</h3>
						<motion.div
							animate={{ opacity: saved ? 1 : 0 }}
							className="flex items-center gap-1 text-xs 
								text-green-600 dark:text-green-400"
						>
							<Check className="w-3 h-3" />
							<span>已保存</span>
						</motion.div>
					</div>

					{/* 横线纸张效果 */}
					<div className="relative flex-1">
						{/* 横线背景 */}
						<div 
							className="absolute inset-0 pointer-events-none opacity-30"
							style={{
								backgroundImage: 'repeating-linear-gradient(
									transparent,
									transparent 31px,
									rgba(251, 191, 36, 0.3) 31px,
									rgba(251, 191, 36, 0.3) 32px
								)',
								backgroundPosition: '0 8px'
							}}
						/>
						
						<textarea
							ref={textareaRef}
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="记录本周的设计灵感..."
							className="w-full h-[calc(100%-2rem)] bg-transparent 
								resize-none outline-none font-hand text-lg 
								text-amber-900 dark:text-amber-100 
								placeholder:text-amber-400/50 leading-8
								dark:placeholder:text-amber-600/40"
							style={{ lineHeight: '32px' }}
						/>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

/**
 * 获取当前周数
 */
function getWeekNumber(date: Date): number {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
	const dayNum = d.getUTCDay() || 7
	d.setUTCDate(d.getUTCDate() + 4 - dayNum)
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
	return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}
