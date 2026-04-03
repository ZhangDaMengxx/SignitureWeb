import { motion } from 'framer-motion'

interface WashiTapeProps {
	color?: 'pink' | 'blue' | 'yellow' | 'green' | 'white'
	rotation?: number
	className?: string
	variant?: 'solid' | 'striped' | 'dots'
}

/**
 * 纸胶带装饰组件
 * 设计意图: 模拟和纸胶带的半透明质感
 */
export function WashiTape({ 
	color = 'white', 
	rotation = -2,
	className = '',
	variant = 'solid'
}: WashiTapeProps) {
	const colorClasses = {
		pink: 'bg-pink-200/60 dark:bg-pink-300/40',
		blue: 'bg-blue-200/60 dark:bg-blue-300/40',
		yellow: 'bg-yellow-200/60 dark:bg-yellow-300/40',
		green: 'bg-green-200/60 dark:bg-green-300/40',
		white: 'bg-white/40 dark:bg-white/20',
	}

	const patterns = {
		solid: '',
		striped: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 10px)',
		dots: 'radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)',
	}

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			className={`
				absolute h-6 backdrop-blur-sm shadow-sm
				${colorClasses[color]}
				${className}
			`}
			style={{
				transform: `rotate(${rotation}deg)`,
				backgroundImage: patterns[variant],
				backgroundSize: variant === 'dots' ? '8px 8px' : 'auto',
			}}
		>
			{/* 胶带边缘毛边效果 */}
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r 
				from-transparent via-current to-transparent opacity-30" />
			<div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r 
				from-transparent via-current to-transparent opacity-30" />
		</motion.div>
	)
}

/**
 * 图钉装饰组件
 */
interface PushPinProps {
	color?: 'red' | 'blue' | 'yellow' | 'green'
	className?: string
}

export function PushPin({ color = 'red', className = '' }: PushPinProps) {
	const colorClasses = {
		red: 'bg-gradient-to-br from-red-400 to-red-600',
		blue: 'bg-gradient-to-br from-blue-400 to-blue-600',
		yellow: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
		green: 'bg-gradient-to-br from-green-400 to-green-600',
	}

	return (
		<motion.div
			whileHover={{ scale: 1.1, y: -2 }}
			className={`absolute w-4 h-4 rounded-full ${colorClasses[color]} 
				shadow-md ${className}`}
			style={{
				boxShadow: 'inset -1px -1px 2px rgba(0,0,0,0.2), 1px 2px 4px rgba(0,0,0,0.2)'
			}}
		>
			{/* 高光 */}
			<div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 
				rounded-full bg-white/40" />
		</motion.div>
	)
}

/**
 * 回形针装饰组件
 */
interface PaperClipProps {
	className?: string
	color?: 'silver' | 'gold' | 'copper'
}

export function PaperClip({ className = '', color = 'silver' }: PaperClipProps) {
	const colorClasses = {
		silver: 'text-slate-400',
		gold: 'text-amber-400',
		copper: 'text-orange-400',
	}

	return (
		<motion.div
			initial={{ opacity: 0, rotate: -20 }}
			animate={{ opacity: 1, rotate: 0 }}
			className={`absolute ${colorClasses[color]} ${className}`}
		>
			<svg 
				width="20" 
				height="40" 
				viewBox="0 0 20 40" 
				fill="none" 
				className="drop-shadow-sm"
			>
				<path
					d="M10 35V8a4 4 0 1 1 8 0v20"
					stroke="currentColor"
					strokeWidth="3"
					strokeLinecap="round"
					fill="none"
				/>
				<path
					d="M10 35V8"
					stroke="currentColor"
					strokeWidth="3"
					strokeLinecap="round"
				/>
			</svg>
		</motion.div>
	)
}

/**
 * 便签折角效果
 */
interface FoldedCornerProps {
	className?: string
}

export function FoldedCorner({ className = '' }: FoldedCornerProps) {
	return (
		<div className={`absolute bottom-0 right-0 w-8 h-8 ${className}`}>
			<div className="absolute inset-0 bg-gradient-to-tl 
				from-amber-200/80 to-transparent dark:from-amber-800/50" 
				style={{
					clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
				}}
			/>
			<div className="absolute bottom-0 right-0 w-4 h-4 
				bg-gradient-to-tl from-amber-300/60 to-transparent
				dark:from-amber-700/40"
				style={{
					clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
				}}
			/>
		</div>
	)
}
