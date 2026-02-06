'use client'

import React from 'react'
import Image from 'next/image'
import { FeedItem as FeedItemType } from '../types'

interface FeedItemProps {
    item: FeedItemType
    isActive: boolean
    onDetails?: () => void
}

export const FeedItem = ({ item, isActive, onDetails }: FeedItemProps) => {
    return (
        <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
            {/* Blurred Background (Desktop only) -> Task 3.4 */}
            <div className="absolute inset-0 z-0 hidden md:block opacity-60 pointer-events-none">
                <Image
                    src={item.mediaUrl}
                    alt=""
                    fill
                    className="object-cover blur-3xl scale-110"
                    quality={25}
                    sizes="100vw"
                    aria-hidden="true"
                />
            </div>

            {/* Main Content Container (Mobile Aspect Ratio on Desktop) */}
            <div className="relative z-10 w-full h-full md:max-w-[450px] md:aspect-[9/16] bg-black shadow-2xl">
                {item.mediaType === 'image' && (
                    <Image
                        src={item.mediaUrl}
                        alt={item.product?.title || 'Product Image'}
                        fill
                        className="object-cover"
                        priority={isActive} // Task 3.3: LCP Optimization
                        loading={isActive ? 'eager' : 'lazy'}
                        sizes="(max-width: 768px) 100vw, 450px"
                    />
                )}

                {/* Video support removed per requirements (v1 is Image only) */}

                <div
                    className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pt-20 cursor-pointer active:scale-[0.99] transition-transform flex items-end gap-3"
                    onClick={onDetails}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${item.product?.title}`}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            onDetails?.()
                        }
                    }}
                >
                    {/* Product Bubble Thumbnail */}
                    {item.product.thumbnail && (
                        <div className="relative w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden shrink-0 mb-1">
                            <Image
                                src={item.product.thumbnail}
                                alt={item.product.title}
                                fill
                                className="object-cover"
                                sizes="48px"
                            />
                        </div>
                    )}

                    <div className="flex-1">
                        <h3 className="text-white text-lg font-bold leading-tight">{item.product?.title}</h3>
                        {item.product?.variants?.[0]?.prices?.[0] && (
                            <p className="text-[#d1751e] text-sm font-bold">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: item.product.variants[0].prices[0].currency_code }).format(item.product.variants[0].prices[0].amount / 100)}
                            </p>
                        )}
                        {item.type === 'wear_test' && (
                            <span className="inline-block px-2 py-0.5 mt-1 text-[10px] uppercase tracking-wide font-bold text-black bg-white rounded-full">
                                Wear Test
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
