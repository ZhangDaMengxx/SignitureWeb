import { useState, useEffect, useCallback } from 'react'

type Theme = 'light' | 'dark' | 'system'

/**
 * 主题管理 Hook
 * 设计意图: 支持浅色/深色/系统三种模式，持久化存储
 */
export function useTheme() {
	const [theme, setThemeState] = useState<Theme>(() => {
		// 从 localStorage 读取
		if (typeof window !== 'undefined') {
			return (localStorage.getItem('theme') as Theme) || 'system'
		}
		return 'system'
	})

	const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

	// 应用主题到 DOM
	const applyTheme = useCallback((newTheme: Theme) => {
		const root = document.documentElement
		const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
		const isDark = newTheme === 'dark' || (newTheme === 'system' && systemDark)

		if (isDark) {
			root.classList.add('dark')
			setResolvedTheme('dark')
		} else {
			root.classList.remove('dark')
			setResolvedTheme('light')
		}
	}, [])

	// 设置主题
	const setTheme = useCallback((newTheme: Theme) => {
		setThemeState(newTheme)
		localStorage.setItem('theme', newTheme)
		applyTheme(newTheme)
	}, [applyTheme])

	// 切换主题
	const toggleTheme = useCallback(() => {
		const next = resolvedTheme === 'light' ? 'dark' : 'light'
		setTheme(next)
	}, [resolvedTheme, setTheme])

	// 初始化
	useEffect(() => {
		applyTheme(theme)

		// 监听系统主题变化
		const media = window.matchMedia('(prefers-color-scheme: dark)')
		const handler = () => {
			if (theme === 'system') {
				applyTheme('system')
			}
		}

		media.addEventListener('change', handler)
		return () => media.removeEventListener('change', handler)
	}, [theme, applyTheme])

	return {
		theme,
		resolvedTheme,
		setTheme,
		toggleTheme,
		isDark: resolvedTheme === 'dark',
	}
}
