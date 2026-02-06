'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'

export interface FloatingNavProps {
    /** Hide delay in milliseconds (default: 3000ms per UX spec) */
    hideDelay?: number
    /** Callback for menu button click */
    onMenu?: () => void
    /** Callback for search button click */
    onSearch?: () => void
    /** Callback for cart button click */
    onCart?: () => void
}

/**
 * FloatingNav - Semi-transparent floating navigation icons
 * 
 * Implements AC: 5 - Navigation Chrome
 * - Semi-transparent floating icons in top corners
 * - Auto-hide on scroll, show on interaction pattern
 * - Only visible when interacting
 */
export const FloatingNav = ({
    hideDelay = 3000,
    onMenu,
    onSearch,
    onCart
}: FloatingNavProps) => {
    const [isVisible, setIsVisible] = useState(true)
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Reset hide timer
    const resetHideTimer = useCallback(() => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
        }
        setIsVisible(true)
        hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false)
        }, hideDelay)
    }, [hideDelay])

    // Show on any user interaction
    useEffect(() => {
        const handleInteraction = () => {
            resetHideTimer()
        }

        // Listen for touch/mouse/keyboard interactions
        window.addEventListener('touchstart', handleInteraction, { passive: true })
        window.addEventListener('mousemove', handleInteraction, { passive: true })
        window.addEventListener('keydown', handleInteraction, { passive: true })
        window.addEventListener('scroll', handleInteraction, { passive: true })

        // Schedule initial timer (avoid synchronous setState in effect body)
        const initialTimerId = setTimeout(() => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current)
            }
            hideTimeoutRef.current = setTimeout(() => {
                setIsVisible(false)
            }, hideDelay)
        }, 0)

        return () => {
            // Note: passive option doesn't affect removeEventListener, but included for consistency
            window.removeEventListener('touchstart', handleInteraction)
            window.removeEventListener('mousemove', handleInteraction)
            window.removeEventListener('keydown', handleInteraction)
            window.removeEventListener('scroll', handleInteraction)
            clearTimeout(initialTimerId)
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current)
            }
        }
    }, [resetHideTimer, hideDelay])

    return (
        <nav
            className={`
                fixed top-0 left-0 right-0 z-30
                pointer-events-none
                transition-opacity duration-300
                ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}
            aria-label="Main navigation"
            aria-hidden={!isVisible}
        >
            <div className="flex justify-between items-start p-4 safe-area-inset">
                {/* Left: Menu/Logo */}
                <button
                    onClick={onMenu}
                    className="
                        pointer-events-auto
                        touch-target
                        flex items-center justify-center
                        w-11 h-11
                        rounded-full
                        backdrop-blur-md
                        transition-all duration-200
                        active:scale-95
                    "
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.3)', // Fallback
                        color: 'var(--foreground)',
                        // Using style for theme tokens that might not be in Tailwind buffer yet
                        // In a real setup, these would be utility classes like bg-surface/30
                    }}
                    aria-label="Menu"
                    tabIndex={isVisible ? 0 : -1}
                >
                    <MenuIcon />
                </button>

                {/* Right: Search + Cart */}
                <div className="flex gap-2">
                    <button
                        onClick={onSearch}
                        className="
                            pointer-events-auto
                            touch-target
                            flex items-center justify-center
                            w-11 h-11
                            rounded-full
                            backdrop-blur-md
                            transition-all duration-200
                            active:scale-95
                        "
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            color: 'var(--foreground)',
                        }}
                        aria-label="Search"
                        tabIndex={isVisible ? 0 : -1}
                    >
                        <SearchIcon />
                    </button>
                    <button
                        onClick={onCart}
                        className="
                            pointer-events-auto
                            touch-target
                            flex items-center justify-center
                            w-11 h-11
                            rounded-full
                            backdrop-blur-md
                            transition-all duration-200
                            active:scale-95
                        "
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            color: 'var(--foreground)',
                        }}
                        aria-label="Shopping cart"
                        tabIndex={isVisible ? 0 : -1}
                    >
                        <CartIcon />
                    </button>
                </div>
            </div>
        </nav>
    )
}

// Icon components (minimal inline SVGs)
const MenuIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
)

const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
    </svg>
)

const CartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <path d="M3 6h18M16 10a4 4 0 01-8 0" />
    </svg>
)
