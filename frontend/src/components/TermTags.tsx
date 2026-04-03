import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Copy, Check } from 'lucide-react'
import type { Term } from '../types'

interface TermTagsProps {
	terms: Term[]
}

/**
 * 术语标签组件
 * 设计意图: 紧凑展示，悬停展开，支持复制和编辑
 */
export function TermTags({ terms }: TermTagsProps) {
	const [isExpanded, setIsExpanded] = useState(false)
	const [copiedId, setCopiedId] = useState<string | null>(null)
	const [localTerms, setLocalTerms] = useState<Term[]>(terms)

	const handleCopy = useCallback(async (term: Term) => {
		try {
			await navigator.clipboard.writeText(term.text)
			setCopiedId(term.id)
			setTimeout(() => setCopiedId(null), 1500)
		} catch {
			// 复制失败静默处理
		}
	}, [])

	const handleDelete = useCallback((termId: string) => {
		setLocalTerms(prev => prev.filter(t => t.id !== termId))
	}, [])

	const handleAdd = useCallback(() => {
		const text = prompt('输入新标签:')
		if (!text?.trim()) return

		const newTerm: Term = {
			id: `${Date.now()}`,
			cardId: '',
			text: text.trim(),
			isAiGenerated: false,
			orderIndex: localTerms.length,
		}
		setLocalTerms(prev => [...prev, newTerm])
	}, [localTerms.length])

	const displayCount = localTerms.length

	return (
		<div 
			className="relative"
			onMouseEnter={() => setIsExpanded(true)}
			onMouseLeave={() => setIsExpanded(false)}
		>
			{/* 紧凑视图 */}
			{!isExpanded && (
				<div className="flex items-center gap-1 flex-wrap">
					{localTerms[0] && (
						<span 
							onClick={() => handleCopy(localTerms[0])}
							className="px-2 py-0.5 bg-amber-100 dark:bg-amber-800/50 
								text-amber-800 dark:text-amber-200 text-xs rounded-full
								cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-700/50
								transition-colors font-hand"
						>
							{localTerms[0].text}
							{displayCount > 1 && (
								<span className="ml-1 text-amber-600 dark:text-amber-400">
									+{displayCount - 1}
								</span>
							)}
						</span>
					)}
					<button
						onClick={handleAdd}
						className="p-0.5 rounded-full hover:bg-amber-100 
							dark:hover:bg-amber-800/50 transition-colors"
					>
						<Plus className="w-3 h-3 text-amber-600 dark:text-amber-400" />
					</button>
				</div>
			)}

			{/* 展开视图 */}
			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className="absolute z-20 left-0 top-full mt-1 
							bg-white dark:bg-amber-900 p-2 rounded-lg 
							shadow-lg min-w-[120px]"
					>
						<div className="flex flex-wrap gap-1">
							{localTerms.map(term => (
								<div
									key={term.id}
									className="group flex items-center gap-1 
										px-2 py-0.5 bg-amber-100 dark:bg-amber-800/50 
										text-amber-800 dark:text-amber-200 text-xs rounded-full"
								>
									<span
										onClick={() => handleCopy(term)}
										className="cursor-pointer flex items-center gap-1"
									>
										{term.text}
										{copiedId === term.id ? (
											<Check className="w-3 h-3 text-green-500" />
										) : (
											<Copy className="w-3 h-3 opacity-0 group-hover:opacity-50" />
										)}
									</span>
									<button
										onClick={() => handleDelete(term.id)}
										className="opacity-0 group-hover:opacity-100 
											hover:text-red-500 transition-opacity"
									>
										<X className="w-3 h-3" />
									</button>
								</div>
							))}
							<button
								onClick={handleAdd}
								className="p-0.5 rounded-full hover:bg-amber-100 
									dark:hover:bg-amber-800/50 transition-colors"
							>
								<Plus className="w-3 h-3 text-amber-600 dark:text-amber-400" />
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
