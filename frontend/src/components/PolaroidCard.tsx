import { useState } from 'react'
import { motion } from 'framer-motion'
import { TermTags } from './TermTags'
import type { Card } from '../types'

interface PolaroidCardProps {
	card: Card
}

/**
 * 随机装饰类型
 */
type Decoration = 'tape' | 'pin' | 'clip' | 'corner'

const DECORATIONS: Decoration[] = ['tape', 'pin', 'clip', 'corner']

/**
 * 获取随机装饰
 * 设计意图: 每张卡片有独特的装饰组合
 */
function getRandomDecorations(): Decoration[] {
	const count = Math.floor(Math.random() * 2) + 1
	const shuffled = [...DECORATIONS].sort(() => Math.random() - 0.5)
	return shuffled.slice(0, count)
}

/**
 * 宝丽来风格卡片组件
 * 设计意图: 模拟拍立得照片效果，带随机装饰
 */
export function PolaroidCard({ card }: PolaroidCardProps) {
	const [decorations] = useState(getRandomDecorations)
	const [rotation] = useState(() => (Math.random() - 0.5) * 6)
	const [imageLoaded, setImageLoaded] = useState(false)
	const [imageError, setImageError] = useState(false)

	const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001'

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
			animate={{ opacity: 1, scale: 1, rotate: rotation }}
			whileHover={{ scale: 1.02, rotate: 0, zIndex: 10 }}
			transition={{ type: 'spring', stiffness: 300, damping: 20 }}
			className="relative bg-white dark:bg-amber-50 p-2 pb-3 
				shadow-polaroid rounded-sm w-[140px]"
		>
			{/* 装饰元素 */}
			{decorations.includes('tape') && (
				<div className="absolute -top-2 left-1/2 -translate-x-1/2 
					w-12 h-5 tape opacity-70" />
			)}
			{decorations.includes('pin') && (
				<div className="absolute -top-1.5 right-3 w-3 h-3 
					rounded-full bg-red-400 shadow-sm" />
			)}
			{decorations.includes('clip') && (
				<div className="absolute -top-1 left-2 w-4 h-6 
					border-2 border-slate-400 rounded-full" />
			)}
			{decorations.includes('corner') && (
				<div className="absolute bottom-0 right-0 w-6 h-6 
					bg-gradient-to-tl from-amber-200/50 to-transparent" />
			)}

			{/* 图片区域 */}
			<div className="aspect-square bg-amber-100 dark:bg-amber-200/50 
				rounded overflow-hidden relative">
				{!imageLoaded && !imageError && (
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-6 h-6 border-2 border-amber-300 
							border-t-amber-500 rounded-full animate-spin" />
					</div>
				)}
				
				{card.imageUrl && !imageError ? (
					<img
						src={`${apiBase}${card.imageUrl}`}
						alt="灵感图片"
						className={`w-full h-full object-cover transition-opacity
							${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
						onLoad={() => setImageLoaded(true)}
						onError={() => setImageError(true)}
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center
						text-amber-300 dark:text-amber-400/50 text-4xl font-hand">
						?
					</div>
				)}
			</div>

			{/* 术语标签 */}
			<div className="mt-2">
				<TermTags 
					cardId={card.id} 
					initialTerms={card.terms} 
				/>
			</div>
		</motion.div>
	)
}
