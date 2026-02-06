'use client'

import React, { useCallback, useEffect, useRef } from 'react'

export interface GhostControlsProps {
    /** Callback when user navigates to previous item */
    onPrevious: () => void
    /** Callback when user navigates to next item */
    onNext: () => void
    /** Callback when user wants to buy/view details */
    onDetails: () => void
    /** Whether there is a previous item available */
    hasPrevious: boolean
    /** Whether there is a next item available */
    hasNext: boolean
    /** Current product title for ARIA labels */
    currentProductTitle?: string
}

/**
 * GhostControls - Invisible but focusable navigation controls
 * 
 * Implements AC: 3 - Ghost Controls for screen readers and keyboard navigation
 * - Hidden buttons (opacity: 0) but focusable for "Next Video", "Previous Video", "Buy Now"
 * - Full keyboard/VoiceOver navigation without cluttering visual UI
 * - Arrow Up/Down for navigation
 */
export const GhostControls = ({
    onPrevious,
    onNext,
    onDetails,
    hasPrevious,
    hasNext,
    currentProductTitle = 'Product'
}: GhostControlsProps) => {
    const containerRef = useRef<HTMLDivElement>(null)

    // Handle keyboard navigation
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'k': // vim-style navigation
                event.preventDefault()
                if (hasPrevious) {
                    onPrevious()
                }
                break
            case 'ArrowDown':
            case 'j': // vim-style navigation
                event.preventDefault()
                if (hasNext) {
                    onNext()
                }
                break
            case 'Enter':
            case ' ':
                // Only handle if no button is focused
                if (document.activeElement === document.body ||
                    document.activeElement === containerRef.current) {
                    event.preventDefault()
                    onDetails()
                }
                break
        }
    }, [hasPrevious, hasNext, onPrevious, onNext, onDetails])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    return (
        <div
            ref={containerRef}
            role="group"
            aria-label="Feed navigation controls"
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 'var(--z-ghost-controls, 10)' }}
        >
            {/* Previous Product Button */}
            <button
                onClick={onPrevious}
                disabled={!hasPrevious}
                aria-label={`Previous product${hasPrevious ? '' : ' (at beginning)'}`}
                aria-disabled={!hasPrevious}
                className="opacity-0 w-12 h-12 fixed left-4 top-1/2 -translate-y-1/2 pointer-events-auto focus:opacity-100 focus:bg-black/80 focus:text-white rounded touch-target"
                style={{ zIndex: 'var(--z-ghost-controls)' }}
                tabIndex={hasPrevious ? 0 : -1}
            >
                Previous product
            </button>

            {/* Next Product Button */}
            <button
                onClick={onNext}
                disabled={!hasNext}
                aria-label={`Next product${hasNext ? '' : ' (at end)'}`}
                aria-disabled={!hasNext}
                className="opacity-0 w-12 h-12 fixed right-4 top-1/2 -translate-y-1/2 pointer-events-auto focus:opacity-100 focus:bg-black/80 focus:text-white rounded touch-target"
                style={{ zIndex: 'var(--z-ghost-controls)' }}
                tabIndex={hasNext ? 0 : -1}
            >
                Next product
            </button>

            {/* View Details Button */}
            <button
                onClick={onDetails}
                aria-label={`Buy ${currentProductTitle} Now`}
                className="opacity-0 w-full h-16 fixed bottom-0 left-0 pointer-events-auto focus:opacity-100 focus:bg-black/80 focus:text-white touch-target"
                style={{ zIndex: 'var(--z-ghost-controls)' }}
            >
                Buy Now
            </button>

            {/* Screen reader announcement region */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                Currently viewing: {currentProductTitle}
            </div>
        </div>
    )
}
