'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface MediaCarouselProps {
    media: string[]
    aspectRatio?: number // default 1 (square) or 4/5
}

export const MediaCarousel = ({ media, aspectRatio = 1 }: MediaCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    // Handle single or no media
    if (!media || media.length === 0) return null

    if (media.length === 1) {
        return (
            <div className="relative w-full rounded-xl overflow-hidden bg-gray-900 mb-6" style={{ aspectRatio }}>
                <MediaItem url={media[0]} />
            </div>
        )
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % media.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + media.length) % media.length)
    }

    return (
        <div
            className="relative w-full mb-6 group"
            role="region"
            aria-roledescription="carousel"
            aria-label="Product media gallery"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') prevSlide()
                if (e.key === 'ArrowRight') nextSlide()
            }}
        >
            <div
                className="relative w-full rounded-xl overflow-hidden bg-gray-900"
                style={{ aspectRatio }}
            >
                <div className="absolute inset-0 flex">
                    <AnimatePresence initial={false} mode="popLayout">
                        <motion.div
                            key={currentIndex}
                            className="absolute inset-0 w-full h-full"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.5}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = offset.x

                                if (swipe < -50 || velocity.x < -100) {
                                    nextSlide()
                                } else if (swipe > 50 || velocity.x > 100) {
                                    prevSlide()
                                }
                            }}
                        >
                            <MediaItem url={media[currentIndex]} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Dots / Indicators */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
                    {media.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex
                                ? 'bg-white w-4'
                                : 'bg-white/40 hover:bg-white/60'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

const MediaItem = ({ url }: { url: string }) => {
    const isVideo = url.endsWith('.mp4') || url.endsWith('.webm')

    if (isVideo) {
        return (
            <video
                src={url}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
            />
        )
    }

    return (
        <div className="relative w-full h-full">
            <Image
                src={url}
                alt="Product detail"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
            />
        </div>
    )
}
