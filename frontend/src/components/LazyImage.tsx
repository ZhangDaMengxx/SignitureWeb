import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface LazyImageProps {
	src: string
	alt: string
	className?: string
	placeholderSrc?: string
}

/**
 * 懒加载图片组件
 * 设计意图: 使用 Intersection Observer 实现图片懒加载
 */
export function LazyImage({
	src,
	alt,
	className = '',
	placeholderSrc,
}: LazyImageProps) {
	const [isLoaded, setIsLoaded] = useState(false)
	const [isInView, setIsInView] = useState(false)
	const imgRef = useRef<HTMLImageElement>(null)

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsInView(true)
					observer.disconnect()
				}
			},
			{
				rootMargin: '50px', // 提前 50px 开始加载
				threshold: 0.01,
			}
		)

		if (imgRef.current) {
			observer.observe(imgRef.current)
		}

		return () => observer.disconnect()
	}, [])

	return (
		<div ref={imgRef} className={`relative overflow-hidden ${className}`}>
			{/* 占位符 */}
			{!isLoaded && (
				<div className="absolute inset-0 bg-amber-100 dark:bg-amber-800/30 
					animate-pulse flex items-center justify-center">
					<span className="text-2xl opacity-30">🖼️</span>
				</div>
			)}

			{/* 实际图片 */}
			{isInView && (
				<motion.img
					src={src}
					alt={alt}
					initial={{ opacity: 0 }}
					animate={{ opacity: isLoaded ? 1 : 0 }}
					transition={{ duration: 0.3 }}
					onLoad={() => setIsLoaded(true)}
					className="w-full h-full object-cover"
				/>
			)}
		</div>
	)
}
