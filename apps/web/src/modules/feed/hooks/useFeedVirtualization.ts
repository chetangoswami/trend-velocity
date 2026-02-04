import { useState, useCallback, useRef, useEffect } from 'react'

export interface UseFeedVirtualizationProps {
    itemCount: number
    onEndReached?: () => void
    endReachedThreshold?: number
}

export interface VirtualizationState {
    currentIndex: number
    direction: 'up' | 'down'
}

export function useFeedVirtualization({
    itemCount,
    onEndReached,
    endReachedThreshold = 3
}: UseFeedVirtualizationProps) {
    const [state, setState] = useState<VirtualizationState>({
        currentIndex: 0,
        direction: 'down',
    })

    // Use a ref for onEndReached so it doesn't destabilize setCurrentIndex
    const onEndReachedRef = useRef(onEndReached)
    useEffect(() => {
        onEndReachedRef.current = onEndReached
    }, [onEndReached])

    // Track current index in ref for synchronous access
    const currentIndexRef = useRef(0)

    const setCurrentIndex = useCallback((index: number) => {
        const prevIndex = currentIndexRef.current
        const direction = index >= prevIndex ? 'down' : 'up'

        currentIndexRef.current = index

        setState({
            currentIndex: index,
            direction,
        })

        // Trigger end reached if we are close to the end
        if (onEndReachedRef.current && index >= itemCount - endReachedThreshold && index > prevIndex) {
            onEndReachedRef.current()
        }
    }, [itemCount, endReachedThreshold])

    // Helper to determine if an item should be rendered
    // We strictly render current, previous, and next (window of 3)
    const shouldRenderItem = useCallback((index: number) => {
        const { currentIndex } = state
        return index >= currentIndex - 1 && index <= currentIndex + 1
    }, [state])

    // Refs for observing items
    const observerRef = useRef<IntersectionObserver | null>(null)

    // Callback ref to register items
    const registerItem = useCallback((element: HTMLElement | null, index: number) => {
        if (!element) return

        // Initialize observer if not exists
        if (!observerRef.current) {
            observerRef.current = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Get index from data attribute
                        const idx = Number(entry.target.getAttribute('data-index'))
                        if (!isNaN(idx)) {
                            setCurrentIndex(idx)
                        }
                    }
                })
            }, {
                root: null, // viewport
                threshold: 0.6, // 60% visibility required to be "current"
            })
        }

        // Observe the element
        element.setAttribute('data-index', String(index))
        observerRef.current.observe(element)
    }, [setCurrentIndex])

    // Cleanup observer
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [])

    return {
        currentIndex: state.currentIndex,
        direction: state.direction,
        setCurrentIndex,
        shouldRenderItem,
        registerItem
    }
}
