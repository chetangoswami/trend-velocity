import { renderHook, act } from '@testing-library/react'
import { useFeedVirtualization } from './useFeedVirtualization'

describe('useFeedVirtualization', () => {
    it('should initialize with index 0 and direction down', () => {
        const { result } = renderHook(() => useFeedVirtualization({ itemCount: 10 }))

        expect(result.current.currentIndex).toBe(0)
        expect(result.current.direction).toBe('down')
    })

    it('should update index and direction correctly', () => {
        const { result } = renderHook(() => useFeedVirtualization({ itemCount: 10 }))

        act(() => {
            result.current.setCurrentIndex(1)
        })
        expect(result.current.currentIndex).toBe(1)
        expect(result.current.direction).toBe('down')

        act(() => {
            result.current.setCurrentIndex(0)
        })
        expect(result.current.currentIndex).toBe(0)
        expect(result.current.direction).toBe('up')
    })

    it('should not update if index is out of bounds', () => {
        const { result } = renderHook(() => useFeedVirtualization({ itemCount: 5 }))

        act(() => {
            result.current.setCurrentIndex(-1)
        })
        expect(result.current.currentIndex).toBe(0)

        act(() => {
            result.current.setCurrentIndex(5) // Index 5 is out of bounds for length 5 (0-4)
        })
        expect(result.current.currentIndex).toBe(0)
    })

    it('should correctly determine if item should be rendered (window of 3)', () => {
        const { result } = renderHook(() => useFeedVirtualization({ itemCount: 10 }))

        // At index 0: should render 0, 1. (Index -1 doesn't exist but logic holds)
        expect(result.current.shouldRenderItem(0)).toBe(true)
        expect(result.current.shouldRenderItem(1)).toBe(true)
        expect(result.current.shouldRenderItem(2)).toBe(false)

        // Move to index 5
        act(() => {
            result.current.setCurrentIndex(5)
        })

        // At index 5: should render 4, 5, 6
        expect(result.current.shouldRenderItem(3)).toBe(false)
        expect(result.current.shouldRenderItem(4)).toBe(true) // 5-1
        expect(result.current.shouldRenderItem(5)).toBe(true) // 5
        expect(result.current.shouldRenderItem(6)).toBe(true) // 5+1
        expect(result.current.shouldRenderItem(7)).toBe(false)
    })
})
