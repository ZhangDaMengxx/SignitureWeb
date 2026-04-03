import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WeekView } from '../WeekView'

describe('WeekView', () => {
	it('渲染周视图组件', () => {
		render(<WeekView />)
		
		// 验证导航按钮存在
		expect(screen.getByLabelText('上一周')).toBeDefined()
		expect(screen.getByLabelText('下一周')).toBeDefined()
		
		// 验证日期格子存在
		expect(screen.getByText('周一')).toBeDefined()
		expect(screen.getByText('周二')).toBeDefined()
		expect(screen.getByText('周三')).toBeDefined()
		expect(screen.getByText('周四')).toBeDefined()
		expect(screen.getByText('周五')).toBeDefined()
		expect(screen.getByText('周末')).toBeDefined()
	})
})
