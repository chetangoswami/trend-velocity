'use client'

import React, { useState, useCallback } from 'react'
import { FeedItem as FeedItemType } from '../types'
import { useFeedVirtualization } from '../hooks/useFeedVirtualization'
import { FeedItem } from './FeedItem'
import { getFeedProducts } from '../services'

interface FeedContainerProps {
    items: FeedItemType[]
}

export const FeedContainer = ({ items: initialItems }: FeedContainerProps) => {
    const [items, setItems] = useState<FeedItemType[]>(initialItems)
    const [page, setPage] = useState(1) // Start next page at 1 (0 was initial)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [error, setError] = useState<string | null>(null)

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

    const { currentIndex, shouldRenderItem, registerItem } = useFeedVirtualization({
        itemCount: items.length,
        onEndReached: loadMore
    })

    if (!items || items.length === 0) {
        return (
            <div className="h-dvh w-full flex flex-col items-center justify-center bg-black text-white p-4 text-center">
                <h2 className="text-xl font-bold mb-2">No Trends Found</h2>
                <p className="text-gray-400">We couldn&apos;t load the feed right now. Please try again later.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-white text-black rounded-full font-medium active:scale-95 transition-transform"
                >
                    Refresh
                </button>
            </div>
        )
    }

    return (
        <div
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
                        ref={(el) => registerItem(el, index)}
                        className="h-dvh w-full snap-start snap-always relative flex items-center justify-center bg-black"
                    >
                        {shouldRender ? (
                            <FeedItem item={item} isActive={isActive} />
                        ) : null}
                    </div>
                )
            })}
        </div>
    )
}
