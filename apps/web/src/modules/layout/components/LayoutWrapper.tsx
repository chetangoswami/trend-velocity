'use client'

import React, { ReactNode } from 'react'

interface LayoutWrapperProps {
    children: ReactNode
}

/**
 * LayoutWrapper - Responsive layout container
 * 
 * Implements AC: 4 - Responsive breakpoints
 * - Mobile (<768px): Full-bleed Feed
 * - Tablet (768px - 1024px): Feed + minimal padding
 * - Desktop (>1024px): Feed centered + blurred gutters + Context Sidebar
 */
export const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
    return (
        <div className="min-h-dvh w-full bg-black overflow-hidden">
            {/* Main Layout Grid */}
            <div className="
                w-full
                h-dvh
                lg:grid
                lg:grid-cols-[1fr_minmax(375px,450px)_320px]
                xl:grid-cols-[1fr_minmax(400px,450px)_400px]
            ">
                {/* Left Gutter (Desktop only) - Blurred ambient background */}
                <div
                    className="hidden lg:block relative overflow-hidden"
                    aria-hidden="true"
                >
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"
                        style={{ backdropFilter: 'blur(40px)' }}
                    />
                </div>

                {/* Main Content Area */}
                <main className="
                    w-full
                    h-dvh
                    relative
                    md:px-4
                    lg:px-0
                ">
                    {children}
                </main>

                {/* Right Sidebar (Desktop only) - Context Panel */}
                <aside
                    className="hidden lg:flex flex-col bg-black/50 border-l border-white/10"
                    aria-label="Product context"
                    id="context-sidebar-portal" // Target for Portal from FeedContainer
                >
                    {/* Content injected via Portal from FeedContainer */}
                </aside>
            </div>
        </div>
    )
}
