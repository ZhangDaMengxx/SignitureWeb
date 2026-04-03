import { useRef, useCallback } from 'react'

/**
 * 防抖 Hook
 * 设计意图: 减少高频事件的触发次数
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
	callback: T,
	delay: number
): (...args: Parameters<T>) => void {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	return useCallback(
		(...args: Parameters<T>) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}

			timeoutRef.current = setTimeout(() => {
				callback(...args)
			}, delay)
		},
		[callback, delay]
	)
}

/**
 * 节流 Hook
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
	callback: T,
	delay: number
): (...args: Parameters<T>) => void {
	const lastCallRef = useRef<number>(0)

	return useCallback(
		(...args: Parameters<T>) => {
			const now = Date.now()
			if (now - lastCallRef.current >= delay) {
				lastCallRef.current = now
				callback(...args)
			}
		},
		[callback, delay]
	)
}
