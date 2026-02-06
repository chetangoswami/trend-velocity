'use client'

import React, { useState, useCallback, useRef } from 'react'
import { FeedItem as FeedItemType } from '../types'
import { useFeedVirtualization } from '../hooks/useFeedVirtualization'
import { createPortal } from 'react-dom'
import { FeedItem } from './FeedItem'
import { GhostControls } from './GhostControls'
import { ImpulseSheet } from './ImpulseSheet'
import { ContextSidebar } from '@/modules/layout/components/ContextSidebar'
import { getFeedProducts } from '../services'

interface FeedContainerProps {
    items: FeedItemType[]
}

export const FeedContainer = ({ items: initialItems }: FeedContainerProps) => {
    const [items, setItems] = useState<FeedItemType[]>(initialItems)
    const [page, setPage] = useState(2) // Start next page at 2 (initialItems is page 1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const itemRefs = useRef<Map<number, HTMLElement>>(new Map())

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return

        setLoading(true)
        try {
            const newItems = await getFeedProducts(page)
            if (newItems.length === 0) {
                setHasMore(false)
            } else {
                setItems(prev => [...prev, ...newItems])
                setPage(prev => prev + 1)
            }
        } catch (error) {
            console.error("Failed to load more items:", error)
            setError("Unable to load more items. Keep scrolling to retry.")
        } finally {
            setLoading(false)
        }
    }, [loading, hasMore, page])

    const { currentIndex, setCurrentIndex, shouldRenderItem, registerItem } = useFeedVirtualization({
        itemCount: items.length,
        onEndReached: loadMore
    })

    // Store refs for keyboard navigation scrolling
    const registerItemWithRef = useCallback((el: HTMLElement | null, index: number) => {
        if (el) {
            itemRefs.current.set(index, el)
        }
        registerItem(el, index)
    }, [registerItem])

    // Scroll to specific index (for keyboard navigation)
    const scrollToIndex = useCallback((index: number) => {
        const element = itemRefs.current.get(index)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [])

    // Ghost Controls callbacks
    const handlePrevious = useCallback(() => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1
            setCurrentIndex(newIndex)
            scrollToIndex(newIndex)
        }
    }, [currentIndex, setCurrentIndex, scrollToIndex])

    const handleNext = useCallback(() => {
        if (currentIndex < items.length - 1) {
            const newIndex = currentIndex + 1
            setCurrentIndex(newIndex)
            scrollToIndex(newIndex)
        }
    }, [currentIndex, items.length, setCurrentIndex, scrollToIndex])

    const handleDetails = useCallback(() => {
        setDetailsOpen(true)
    }, [])

    // Get current product title for accessibility
    const currentProductTitle = items[currentIndex]?.product?.title || 'Product'

    if (!items || items.length === 0) {
        return (
            <div className="h-dvh w-full flex flex-col items-center justify-center bg-black text-white p-4 text-center">
                <h2 className="text-xl font-bold mb-2">No Trends Found</h2>
                <p className="text-gray-400">We couldn&apos;t load the feed right now. Please try again later.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-white text-black rounded-full font-medium active:scale-95 transition-transform touch-target"
                >
                    Refresh
                </button>
            </div>
        )
    }

    // Fix hydration mismatch for Portal
    const [mounted, setMounted] = useState(false)
    React.useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <>
            {/* Ghost Controls for keyboard/screen reader navigation */}
            <GhostControls
                onPrevious={handlePrevious}
                onNext={handleNext}
                onDetails={handleDetails}
                hasPrevious={currentIndex > 0}
                hasNext={currentIndex < items.length - 1}
                currentProductTitle={currentProductTitle}
            />

            {/* Impulse Sheet (Mobile Details) */}
            <ImpulseSheet
                isOpen={detailsOpen}
                onOpenChange={setDetailsOpen}
                product={items[currentIndex]?.product}
            />

            <div
                ref={containerRef}
                className="h-dvh w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
            >
                {error && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/80 backdrop-blur text-white px-4 py-2 rounded-full z-50 text-sm font-medium">
                        {error}
                    </div>
                )}
                {items.map((item, index) => {
                    // We render a container for every item to maintain scroll height
                    // But we only render the content for items in the window
                    const isActive = index === currentIndex
                    const shouldRender = shouldRenderItem(index)

                    return (
                        <div
                            key={item.id}
                            ref={(el) => registerItemWithRef(el, index)}
                            className="h-dvh w-full snap-start snap-always relative flex items-center justify-center bg-black"
                        >
                            {shouldRender ? (
                                <FeedItem item={item} isActive={isActive} onDetails={handleDetails} />
                            ) : null}
                        </div>
                    )
                })}
            </div>

            {/* Desktop Context Sidebar Portal - Only render on client after mount */}
            {mounted && document.getElementById('context-sidebar-portal') && createPortal(
                <ContextSidebar product={items[currentIndex]?.product} />,
                document.getElementById('context-sidebar-portal')!
            )}
        </>
    )
}

