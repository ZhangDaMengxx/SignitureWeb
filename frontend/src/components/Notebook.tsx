import { useState, useCallback, useRef } from 'react'
import { GripHorizontal } from 'lucide-react'

interface NotebookProps {
	height: number
	onHeightChange: (height: number) => void
}

const MIN_HEIGHT = 100
const MAX_HEIGHT = 600

/**
 * 笔记本区域组件
 * 设计意图: 可拖拽调整高度的全宽笔记区域
 */
export function Notebook({ height, onHeightChange }: NotebookProps) {
	const [isDragging, setIsDragging] = useState(false)
	const dragStartY = useRef(0)
	const dragStartHeight = useRef(0)

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
		<div
			className="relative bg-white dark:bg-amber-900/20 
				rounded-xl shadow-polaroid paper-texture overflow-hidden"
			style={{ height }}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseUp}
		>
			{/* 拖拽手柄 */}
			<div
				onMouseDown={handleMouseDown}
				className={`
					absolute top-0 left-0 right-0 h-6 
					flex items-center justify-center
					cursor-ns-resize hover:bg-amber-100/50 
					dark:hover:bg-amber-800/30 transition-colors
					${isDragging ? 'bg-amber-200/50 dark:bg-amber-800/50' : ''}
				`}
			>
				<GripHorizontal className="w-5 h-5 text-amber-400 dark:text-amber-600" />
			</div>

			{/* 笔记本内容 */}
			<div className="p-4 pt-8 h-full overflow-auto">
				<h3 className="text-xl font-hand font-bold text-amber-800 
					dark:text-amber-200 mb-4">
					笔记本
				</h3>
				<textarea
					placeholder="记录你的设计灵感..."
					className="w-full h-[calc(100%-3rem)] bg-transparent 
						resize-none outline-none font-hand text-amber-900 
						dark:text-amber-100 placeholder:text-amber-400/60
						dark:placeholder:text-amber-600/40"
				/>
			</div>

			{/* 装饰线圈 */}
			<div className="absolute top-2 left-8 w-4 h-4 
				rounded-full bg-slate-300 dark:bg-slate-700 shadow-inner" />
			<div className="absolute top-2 right-8 w-4 h-4 
				rounded-full bg-slate-300 dark:bg-slate-700 shadow-inner" />
		</div>
	)
}
