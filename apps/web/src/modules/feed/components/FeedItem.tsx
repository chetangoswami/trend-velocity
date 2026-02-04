'use client'

import React from 'react'
import Image from 'next/image'
import { FeedItem as FeedItemType } from '../types'

interface FeedItemProps {
    item: FeedItemType
    isActive: boolean
}

export const FeedItem = ({ item, isActive }: FeedItemProps) => {
    return (
        <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
            {/* Blurred Background (Desktop only) -> Task 3.4 */}
            <div className="absolute inset-0 z-0 hidden md:block opacity-60 pointer-events-none">
                <Image
                    src={item.mediaUrl}
                    alt=""
                    fill
                    className="object-cover blur-3xl scale-110"
                    quality={10} // Low quality for blur
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

                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pt-20">
                    <h3 className="text-white text-lg font-bold">{item.product?.title}</h3>
                    {item.type === 'wear_test' && (
                        <span className="inline-block px-2 py-1 mt-2 text-xs font-semibold text-black bg-white rounded-full">
                            Wear Test
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
