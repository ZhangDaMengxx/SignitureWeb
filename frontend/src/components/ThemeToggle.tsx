import { Sun, Moon, Monitor } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'

type Theme = 'light' | 'dark' | 'system'

const THEMES: { value: Theme; label: string; icon: typeof Sun }[] = [
	{ value: 'light', label: '浅色', icon: Sun },
	{ value: 'dark', label: '深色', icon: Moon },
	{ value: 'system', label: '跟随系统', icon: Monitor },
]

/**
 * 主题切换组件
 * 设计意图: 拟物化风格的主题切换器
 */
export function ThemeToggle() {
	const { theme, setTheme, resolvedTheme } = useTheme()

	return (
		<div className="relative inline-flex items-center gap-1 p-1 
			bg-amber-100/50 dark:bg-amber-900/30 rounded-full">
			{THEMES.map(({ value, label, icon: Icon }) => {
				const isActive = theme === value

				return (
					<motion.button
						key={value}
						onClick={() => setTheme(value)}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className={`
							relative flex items-center gap-1.5 px-3 py-1.5 
							rounded-full text-sm font-hand transition-all
							${isActive
								? 'text-amber-900 dark:text-amber-100'
								: 'text-amber-600/60 dark:text-amber-400/60 hover:text-amber-700 dark:hover:text-amber-300'
							}
						`}
						title={label}
					>
						{isActive && (
							<motion.div
								layoutId="activeTheme"
								className="absolute inset-0 bg-white dark:bg-amber-800 
									rounded-full shadow-sm"
								transition={{ type: 'spring', stiffness: 500, damping: 30 }}
							/>
						)}
						<span className="relative z-10">
							<Icon className="w-4 h-4" />
						</span>
					</motion.button>
				)
			})}
		</div>
	)
}

/**
 * 简洁主题切换按钮
 */
export function ThemeToggleSimple() {
	const { toggleTheme, isDark } = useTheme()

	return (
		<motion.button
			onClick={toggleTheme}
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.9 }}
			className="p-2 rounded-full bg-white/50 dark:bg-amber-900/30 
				shadow-sm hover:shadow-md transition-shadow"
			aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
		>
			<AnimatePresence mode="wait">
				{isDark ? (
					<motion.div
						key="moon"
						initial={{ rotate: -90, opacity: 0 }}
						animate={{ rotate: 0, opacity: 1 }}
						exit={{ rotate: 90, opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						<Moon className="w-5 h-5 text-amber-300" />
					</motion.div>
				) : (
					<motion.div
						key="sun"
						initial={{ rotate: 90, opacity: 0 }}
						animate={{ rotate: 0, opacity: 1 }}
						exit={{ rotate: -90, opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						<Sun className="w-5 h-5 text-amber-500" />
					</motion.div>
				)}
			</AnimatePresence>
		</motion.button>
	)
}
