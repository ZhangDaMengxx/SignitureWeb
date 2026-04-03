import { useState, useEffect, useRef, useCallback } from 'react'

interface UseVirtualListOptions {
	itemHeight: number
	overscan?: number
}

/**
 * 虚拟列表 Hook
 * 设计意图: 大量数据时只渲染可视区域内的元素
 */
export function useVirtualList<T>(
	items: T[],
	options: UseVirtualListOptions
) {
	const { itemHeight, overscan = 5 } = options
	const containerRef = useRef<HTMLDivElement>(null)
	const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 })

	const updateVisibleRange = useCallback(() => {
		const container = containerRef.current
		if (!container) return

		const { scrollTop, clientHeight } = container
		const start = Math.floor(scrollTop / itemHeight)
		const visibleCount = Math.ceil(clientHeight / itemHeight)

		setVisibleRange({
			start: Math.max(0, start - overscan),
			end: Math.min(items.length, start + visibleCount + overscan),
		})
	}, [itemHeight, items.length, overscan])

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		updateVisibleRange()

		const handleScroll = () => {
			// 使用 requestAnimationFrame 优化滚动性能
			requestAnimationFrame(updateVisibleRange)
		}

		container.addEventListener('scroll', handleScroll)
		return () => container.removeEventListener('scroll', handleScroll)
	}, [updateVisibleRange])

	// 窗口大小变化时重新计算
	useEffect(() => {
		window.addEventListener('resize', updateVisibleRange)
		return () => window.removeEventListener('resize', updateVisibleRange)
	}, [updateVisibleRange])

	const visibleItems = items.slice(visibleRange.start, visibleRange.end)
	const totalHeight = items.length * itemHeight

	return {
		containerRef,
		visibleItems,
		visibleRange,
		totalHeight,
		itemHeight,
	}
}
