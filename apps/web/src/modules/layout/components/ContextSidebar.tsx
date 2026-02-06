'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FeedItem } from '@/modules/feed/types'
import { getProductPrice, getProductDescription } from '@/modules/feed/utils'

import { useProductVariants } from '@/modules/feed/hooks/useProductVariants'
import { MediaCarousel } from '@/modules/feed/components/MediaCarousel'

interface ContextSidebarProps {
    product: FeedItem['product'] | null | undefined
}

export const ContextSidebar = ({ product }: ContextSidebarProps) => {
    // We need to call the hook unconditionally, but handle null product inside or gracefully
    // Since hook expects Product, we cast or handle inside hook. Our hook handles empty variants but maybe not null product?
    // Let's modify hook usage or check product first. 
    // React hooks must be called unconditionally.
    const {
        selectedVariant,
        selectedOptions,
        selectOption,
        formattedPrice,
        isOutOfStock
    } = useProductVariants(product)

    const isLowStock = !isOutOfStock && selectedVariant && (selectedVariant.inventory_quantity || 0) < 5 && (selectedVariant.inventory_quantity || 0) > 0

    if (!product) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500">
                <p>Select an item to view details</p>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col p-8 bg-brand-base/50 backdrop-blur-md border-l border-white/10 overflow-y-auto">
            {/* Media Carousel */}
            {product.wearTestMedia && product.wearTestMedia.length > 0 && (
                <MediaCarousel media={product.wearTestMedia} aspectRatio={1} />
            )}

            {/* Product Title */}
            <h2 className="text-3xl font-bold text-white mb-4">{product.title}</h2>

            {/* Price */}
            <div className="text-accent-gold text-2xl font-bold mb-8 h-8 flex items-center overflow-hidden relative w-full">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={formattedPrice || getProductPrice(product)}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {formattedPrice || getProductPrice(product)}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Description */}
            <div className="text-gray-300 leading-relaxed mb-8">
                <p className="mb-4">
                    {getProductDescription(product)}
                </p>
            </div>

            {/* Variant Selectors */}
            {product.options?.map((option) => (
                <div key={option.id} className="mb-6">
                    <label className="block text-gray-400 text-sm mb-2 uppercase tracking-wide">
                        {option.title}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {option.values.map((val) => {
                            const isSelected = selectedOptions[option.id] === val.value
                            return (
                                <button
                                    key={val.value}
                                    onClick={() => selectOption(option.id, val.value)}
                                    className={`
                                        px-4 py-2 rounded-full text-sm font-medium transition-colors border
                                        ${isSelected
                                            ? 'bg-white text-black border-white'
                                            : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'
                                        }
                                    `}
                                >
                                    {val.value}
                                </button>
                            )
                        })}
                    </div>
                </div>
            ))}

            {/* Actions */}
            <div className="mt-auto space-y-4 pt-8">
                <button
                    className={`w-full py-4 font-bold rounded-full text-lg active:scale-95 transition-transform hover:bg-gray-100 ${isOutOfStock
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed hover:bg-gray-700'
                        : 'bg-white text-black'
                        }`}
                    onClick={() => {
                        // TODO: Story 2-3 - Implement one-tap add to cart
                    }}
                    disabled={isOutOfStock}
                >
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
                {isLowStock && (
                    <p className="text-center text-orange-400 text-xs font-bold uppercase tracking-widest">
                        Low Stock - Only {selectedVariant?.inventory_quantity} Left
                    </p>
                )}
                <button className="w-full py-4 bg-transparent border border-white/20 text-white font-medium rounded-full hover:bg-white/10 transition-colors">
                    Save for Later
                </button>
            </div>
        </div>
    )
}
