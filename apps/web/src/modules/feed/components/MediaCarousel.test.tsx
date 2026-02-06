import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MediaCarousel } from './MediaCarousel'

// Mock framer-motion - filter out motion-specific props
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, initial, animate, exit, transition, drag, dragConstraints, dragElastic, onDragEnd, ...props }: any) => (
            <div {...props}>{children}</div>
        )
    },
    AnimatePresence: ({ children }: any) => <>{children}</>
}))

// Mock next/image - filter out Next.js specific props
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt, fill, sizes, ...props }: any) => <img src={src} alt={alt} {...props} />
}))

describe('MediaCarousel', () => {
    it('returns null when media array is empty', () => {
        const { container } = render(<MediaCarousel media={[]} />)
        expect(container.firstChild).toBeNull()
    })

    it('returns null when media is undefined', () => {
        const { container } = render(<MediaCarousel media={undefined as any} />)
        expect(container.firstChild).toBeNull()
    })

    it('renders single image without navigation dots', () => {
        render(<MediaCarousel media={['https://example.com/image1.jpg']} />)

        // Should render image
        expect(screen.getByAltText('Product detail')).toBeInTheDocument()

        // Should NOT render navigation dots (only 1 item)
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('renders multiple images with navigation dots', () => {
        render(<MediaCarousel media={[
            'https://example.com/image1.jpg',
            'https://example.com/image2.jpg',
            'https://example.com/image3.jpg'
        ]} />)

        // Should render navigation dots
        const dots = screen.getAllByRole('button')
        expect(dots).toHaveLength(3)

        // First dot should have aria-label
        expect(dots[0]).toHaveAttribute('aria-label', 'Go to slide 1')
    })

    it('renders video with correct attributes', () => {
        render(<MediaCarousel media={['https://example.com/video.mp4']} />)

        const video = document.querySelector('video') as HTMLVideoElement
        expect(video).toBeInTheDocument()
        // Boolean attributes - check the property, not the attribute
        expect(video.autoplay).toBe(true)
        expect(video.muted).toBe(true)
        expect(video.loop).toBe(true)
    })

    it('clicking dot changes slide index', () => {
        render(<MediaCarousel media={[
            'https://example.com/image1.jpg',
            'https://example.com/image2.jpg'
        ]} />)

        const dots = screen.getAllByRole('button')

        // Click second dot
        fireEvent.click(dots[1])

        // Second dot should now have expanded width style (active state)
        expect(dots[1]).toHaveClass('w-4')
    })

    it('applies custom aspect ratio', () => {
        const { container } = render(
            <MediaCarousel media={['https://example.com/image1.jpg']} aspectRatio={4 / 5} />
        )

        const carouselContainer = container.querySelector('[style*="aspect-ratio"]')
        expect(carouselContainer).toHaveStyle({ aspectRatio: '0.8' })
    })
})
