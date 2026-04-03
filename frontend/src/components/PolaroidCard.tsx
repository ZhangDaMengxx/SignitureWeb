import { useState } from 'react'
import { motion } from 'framer-motion'
import { TermTags } from './TermTags'
import { WashiTape, PushPin, PaperClip, FoldedCorner } from './WashiTape'
import type { Card } from '../types'

interface PolaroidCardProps {
	card: Card
}

/**
 * 随机装饰配置
 */
interface DecorationConfig {
	hasTape: boolean
	tapeColor: 'pink' | 'blue' | 'yellow' | 'green' | 'white'
	hasPin: boolean
	pinColor: 'red' | 'blue' | 'yellow' | 'green'
	hasClip: boolean
	hasFoldedCorner: boolean
	rotation: number
}

/**
 * 获取随机装饰配置
 * 设计意图: 每张卡片有独特的装饰组合
 */
function getRandomDecorations(): DecorationConfig {
	const colors = ['pink', 'blue', 'yellow', 'green', 'white'] as const
	const pinColors = ['red', 'blue', 'yellow', 'green'] as const

	return {
		hasTape: Math.random() > 0.3,
		tapeColor: colors[Math.floor(Math.random() * colors.length)],
		hasPin: Math.random() > 0.6,
		pinColor: pinColors[Math.floor(Math.random() * pinColors.length)],
		hasClip: Math.random() > 0.7,
		hasFoldedCorner: Math.random() > 0.5,
		rotation: (Math.random() - 0.5) * 8,
	}
}

/**
 * 宝丽来风格卡片组件
 * 设计意图: 模拟拍立得照片效果，带丰富的拟物化装饰
 */
export function PolaroidCard({ card }: PolaroidCardProps) {
	const [decorations] = useState(getRandomDecorations)
	const [imageLoaded, setImageLoaded] = useState(false)
	const [imageError, setImageError] = useState(false)

	const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001'

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9, y: 20 }}
			animate={{ 
				opacity: 1, 
				scale: 1, 
				rotate: decorations.rotation,
				y: 0 
			}}
			whileHover={{ 
				scale: 1.05, 
				rotate: 0, 
				zIndex: 50,
				y: -5,
				transition: { type: 'spring', stiffness: 300, damping: 20 }
			}}
			className="relative bg-white dark:bg-amber-50 p-2.5 pb-4 
				w-[150px] cursor-pointer group"
			style={{
				boxShadow: `
					0 1px 3px rgba(0,0,0,0.1),
					0 4px 12px rgba(0,0,0,0.1),
					0 8px 24px rgba(0,0,0,0.05),
					inset 0 0 0 1px rgba(0,0,0,0.03)
				`,
			}}
		>
			{/* 装饰元素 */}
			{decorations.hasTape && (
				<WashiTape 
					color={decorations.tapeColor}
					rotation={-4 + Math.random() * 4}
					className="-top-2 left-1/2 -translate-x-1/2 w-14 z-10"
					variant="striped"
				/>
			)}

			{decorations.hasPin && (
				<PushPin 
					color={decorations.pinColor}
					className="-top-1.5 right-3 z-10"
				/>
			)}

			{decorations.hasClip && (
				<PaperClip 
					color="silver"
					className="-top-2 left-2 z-10"
				/>
			)}

			{decorations.hasFoldedCorner && (
				<FoldedCorner className="z-0" />
			)}

			{/* 照片内阴影 */}
			<div className="absolute inset-2.5 pointer-events-none z-0"
				style={{
					boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
				}}
			/>

			{/* 图片区域 */}
			<div className="aspect-square bg-gradient-to-br from-amber-50 to-amber-100 
				dark:from-amber-100 dark:to-amber-200 rounded overflow-hidden 
				relative mb-3">
				{!imageLoaded && !imageError && (
					<div className="absolute inset-0 flex items-center justify-center
						bg-amber-50 dark:bg-amber-100">
						<motion.div 
							animate={{ rotate: 360 }}
							transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
							className="w-6 h-6 border-2 border-amber-300 border-t-amber-500 
								rounded-full"
						/>
					</div>
				)}
				
				{card.imageUrl && !imageError ? (
					<img
						src={`${apiBase}${card.imageUrl}`}
						alt="灵感图片"
						className={`w-full h-full object-cover transition-all duration-300
							${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
						onLoad={() => setImageLoaded(true)}
						onError={() => setImageError(true)}
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center
						text-amber-300 dark:text-amber-400/50">
						<span className="text-3xl">🎨</span>
					</div>
				)}
			</div>

			{/* 术语标签 */}
			<TermTags 
				cardId={card.id} 
				initialTerms={card.terms} 
			/>

			{/* 底部日期戳效果 */}
			<div className="mt-2 text-center">
				<p className="text-[10px] text-amber-400/60 dark:text-amber-500/40 
					font-mono tracking-wider">
					{new Date(card.createdAt).toLocaleDateString('zh-CN', {
						month: 'short',
						day: 'numeric'
					})}
				</p>
			</div>
		</motion.div>
	)
}
