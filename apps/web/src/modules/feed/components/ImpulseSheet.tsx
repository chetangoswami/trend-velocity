'use client'

import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { FeedItem } from '../types'
import { getProductPrice, getProductDescription } from '../utils'

import { useProductVariants } from '../hooks/useProductVariants'
import { MediaCarousel } from './MediaCarousel'

interface ImpulseSheetProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    product: FeedItem['product']
}

export const ImpulseSheet = ({ isOpen, onOpenChange, product }: ImpulseSheetProps) => {
    const {
        selectedVariant,
        selectedOptions,
        selectOption,
        formattedPrice,
        isOutOfStock
    } = useProductVariants(product)

    const isLowStock = !isOutOfStock && selectedVariant && (selectedVariant.inventory_quantity || 0) < 5 && (selectedVariant.inventory_quantity || 0) > 0

    if (!product) return null

    return (
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <AnimatePresence>
                {isOpen && (
                    <Dialog.Portal forceMount>
                        {/* Overlay / Backdrop */}
                        <Dialog.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
                            />
                        </Dialog.Overlay>

                        {/* Sheet Content */}
                        <Dialog.Content asChild>
                            <motion.div
                                initial={{ y: '100%' }}
                                animate={{ y: '0%' }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="fixed bottom-0 left-0 right-0 z-50 h-[80vh] md:hidden bg-brand-base rounded-t-3xl shadow-2xl p-6 outline-none flex flex-col"
                                drag="y"
                                dragConstraints={{ top: 0, bottom: 0 }}
                                dragElastic={0.2}
                                onDragEnd={(_, info) => {
                                    if (info.offset.y > 100) {
                                        onOpenChange(false)
                                    }
                                }}
                            >
                                <div className="w-12 h-1.5 bg-gray-500/50 rounded-full mx-auto mb-6 flex-shrink-0" /> {/* Handle */}

                                <div className="flex-1 overflow-y-auto">
                                    {/* Media Carousel */}
                                    <div className="mb-6 -mx-6 md:mx-0">
                                        {product.wearTestMedia && product.wearTestMedia.length > 0 && (
                                            <MediaCarousel media={product.wearTestMedia} aspectRatio={4 / 5} />
                                        )}
                                    </div>

                                    <Dialog.Title className="text-2xl font-bold text-white mb-2">
                                        {product.title}
                                    </Dialog.Title>

                                    <Dialog.Description className="text-gray-300 mb-6">
                                        {getProductDescription(product)}
                                    </Dialog.Description>

                                    <div className="text-accent-gold text-xl font-bold mb-6 h-8 flex items-center overflow-hidden relative">
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
                                </div>

                                <div className="mt-4 flex-shrink-0">
                                    <button
                                        className={`w-full py-4 font-bold rounded-full text-lg active:scale-95 transition-transform ${isOutOfStock
                                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
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
                                        <p className="text-center text-orange-400 text-xs font-bold uppercase tracking-widest mt-2">
                                            Low Stock - Only {selectedVariant?.inventory_quantity} Left
                                        </p>
                                    )}
                                </div>

                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    )
}
