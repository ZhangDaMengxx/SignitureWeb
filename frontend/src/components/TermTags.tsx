import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Copy, Check, Pencil } from 'lucide-react'
import { useTerms } from '../hooks/useTerms'
import type { Term } from '../types'

interface TermTagsProps {
	cardId: string
	initialTerms?: Term[]
}

/**
 * 术语标签组件
 * 设计意图: 紧凑展示，悬停展开，支持复制和编辑
 */
export function TermTags({ cardId, initialTerms = [] }: TermTagsProps) {
	const [isExpanded, setIsExpanded] = useState(false)
	const [copiedId, setCopiedId] = useState<string | null>(null)
	const [editingId, setEditingId] = useState<string | null>(null)
	const [editValue, setEditValue] = useState('')
	const [showAddInput, setShowAddInput] = useState(false)
	const [newTerm, setNewTerm] = useState('')

	const {
		terms,
		loading,
		addTerm,
		updateTerm,
		deleteTerm,
		setTerms,
	} = useTerms(cardId)

	// 初始化术语
	useEffect(() => {
		if (initialTerms.length > 0) {
			setTerms(initialTerms)
		}
	}, [initialTerms, setTerms])

	const handleCopy = useCallback(async (term: Term) => {
		try {
			await navigator.clipboard.writeText(term.text)
			setCopiedId(term.id)
			setTimeout(() => setCopiedId(null), 1500)
		} catch {
			// 复制失败静默处理
		}
	}, [])

	const handleDelete = useCallback(async (termId: string) => {
		await deleteTerm(termId)
	}, [deleteTerm])

	const handleStartEdit = useCallback((term: Term) => {
		setEditingId(term.id)
		setEditValue(term.text)
	}, [])

	const handleSaveEdit = useCallback(async () => {
		if (editingId && editValue.trim()) {
			await updateTerm(editingId, editValue.trim())
			setEditingId(null)
			setEditValue('')
		}
	}, [editingId, editValue, updateTerm])

	const handleAdd = useCallback(async () => {
		if (newTerm.trim()) {
			const success = await addTerm(newTerm.trim())
			if (success) {
				setNewTerm('')
				setShowAddInput(false)
			}
		}
	}, [newTerm, addTerm])

	const displayCount = terms.length

	return (
		<div
			className="relative"
			onMouseEnter={() => setIsExpanded(true)}
			onMouseLeave={() => {
				setIsExpanded(false)
				setEditingId(null)
				setShowAddInput(false)
			}}
		>
			{/* 紧凑视图 */}
			{!isExpanded && (
				<div className="flex items-center gap-1 flex-wrap">
					{terms[0] ? (
						<span
							onClick={() => handleCopy(terms[0])}
							className="px-2 py-0.5 bg-amber-100 dark:bg-amber-800/50 
								text-amber-800 dark:text-amber-200 text-xs rounded-full
								cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-700/50
								transition-colors font-hand truncate max-w-[100px]"
						>
							{terms[0].text}
							{displayCount > 1 && (
								<span className="ml-1 text-amber-600 dark:text-amber-400">
									+{displayCount - 1}
								</span>
							)}
						</span>
					) : (
						<span className="text-xs text-amber-400/50 italic">
							{loading ? '...' : '无标签'}
						</span>
					)}
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
							shadow-lg min-w-[140px] max-w-[200px]"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex flex-wrap gap-1">
							{terms.map(term => (
								<div
									key={term.id}
									className="group flex items-center gap-1 
										px-2 py-0.5 bg-amber-100 dark:bg-amber-800/50 
										text-amber-800 dark:text-amber-200 text-xs rounded-full"
								>
									{editingId === term.id ? (
										<input
											type="text"
											value={editValue}
											onChange={(e) => setEditValue(e.target.value)}
											onBlur={handleSaveEdit}
											onKeyDown={(e) => {
												if (e.key === 'Enter') handleSaveEdit()
												if (e.key === 'Escape') {
													setEditingId(null)
													setEditValue('')
												}
											}}
											className="w-20 bg-transparent outline-none"
											autoFocus
										/>
									) : (
										<>
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
											<div className="flex opacity-0 group-hover:opacity-100 
												transition-opacity gap-0.5">
												<button
													onClick={() => handleStartEdit(term)}
													className="hover:text-amber-600"
												>
													<Pencil className="w-3 h-3" />
												</button>
												<button
													onClick={() => handleDelete(term.id)}
													className="hover:text-red-500"
												>
													<X className="w-3 h-3" />
												</button>
											</div>
										</>
									)}
								</div>
							))}

							{/* 添加新标签 */}
							{showAddInput ? (
								<input
									type="text"
									value={newTerm}
									onChange={(e) => setNewTerm(e.target.value)}
									onBlur={() => {
										if (newTerm.trim()) handleAdd()
										else setShowAddInput(false)
									}}
									onKeyDown={(e) => {
										if (e.key === 'Enter') handleAdd()
										if (e.key === 'Escape') {
											setNewTerm('')
											setShowAddInput(false)
										}
									}}
									placeholder="新标签..."
									className="w-20 px-2 py-0.5 text-xs rounded-full
										bg-amber-50 dark:bg-amber-800/30
										outline-none border border-amber-200"
									autoFocus
								/>
							) : (
								<button
									onClick={() => setShowAddInput(true)}
									className="p-0.5 rounded-full hover:bg-amber-100 
										dark:hover:bg-amber-800/50 transition-colors"
								>
									<Plus className="w-3 h-3 text-amber-600 dark:text-amber-400" />
								</button>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
