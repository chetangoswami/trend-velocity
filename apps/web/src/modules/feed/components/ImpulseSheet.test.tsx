import React from 'react'
import { render, screen } from '@testing-library/react'
import { ImpulseSheet } from './ImpulseSheet'
import type { Product } from '../types'

// Mock dependencies
jest.mock('../hooks/useProductVariants', () => ({
    useProductVariants: jest.fn(() => ({
        selectedVariant: { id: 'var_1', inventory_quantity: 10, prices: [{ amount: 1000, currency_code: 'usd' }] },
        selectedOptions: { 'opt_size': 'M' },
        selectOption: jest.fn(),
        formattedPrice: '$10.00',
        isOutOfStock: false
    }))
}))

// Mock MediaCarousel to simplify testing
jest.mock('./MediaCarousel', () => ({
    MediaCarousel: ({ media }: { media: string[] }) => <div data-testid="media-carousel">{media.length} items</div>
}))

// Mock Dialog parts from Radix & Framer Motion
// We need to render the content even if it's a portal usually, but Radix Dialog requires setup.
// A simpler approach for unit testing the *content* is to mock Radix Dialog to just render children.
jest.mock('@radix-ui/react-dialog', () => ({
    Root: ({ children, open }: any) => open ? <div>{children}</div> : null,
    Portal: ({ children }: any) => <div>{children}</div>,
    Overlay: ({ children }: any) => <div>{children}</div>,
    Content: ({ children }: any) => <div>{children}</div>,
    Title: ({ children }: any) => <h1>{children}</h1>,
    Description: ({ children }: any) => <p>{children}</p>
}))

// Mock Framer Motion - filter out motion-specific props
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, initial, animate, exit, transition, drag, dragConstraints, dragElastic, onDragEnd, ...props }: any) => (
            <div {...props}>{children}</div>
        )
    },
    AnimatePresence: ({ children }: any) => <>{children}</>
}))

const mockProduct: Product = {
    id: 'prod_1',
    title: 'Test Product',
    description: 'Description',
    thumbnail: 'thumb.jpg',
    wearTestMedia: ['vid1.mp4', 'img1.jpg'],
    options: [
        { id: 'opt_size', title: 'Size', values: [{ value: 'S' }, { value: 'M' }] }
    ],
    variants: []
}

describe('ImpulseSheet', () => {
    it('renders correctly when open', () => {
        render(
            <ImpulseSheet
                isOpen={true}
                onOpenChange={jest.fn()}
                product={mockProduct}
            />
        )

        expect(screen.getByText('Test Product')).toBeInTheDocument()
        expect(screen.getByText('$10.00')).toBeInTheDocument()
        expect(screen.getByTestId('media-carousel')).toHaveTextContent('2 items')
    })

    it('shows Low Stock indicator when inventory is low', () => {
        const useProductVariants = require('../hooks/useProductVariants').useProductVariants
        useProductVariants.mockReturnValue({
            selectedVariant: { id: 'var_1', inventory_quantity: 3 },
            selectedOptions: {},
            selectOption: jest.fn(),
            formattedPrice: '$10.00',
            isOutOfStock: false
        })

        render(
            <ImpulseSheet
                isOpen={true}
                onOpenChange={jest.fn()}
                product={mockProduct}
            />
        )

        expect(screen.getByText(/Only 3 Left/i)).toBeInTheDocument()
    })

    it('shows Out of Stock button when out of stock', () => {
        const useProductVariants = require('../hooks/useProductVariants').useProductVariants
        useProductVariants.mockReturnValue({
            selectedVariant: { id: 'var_1', inventory_quantity: 0 },
            selectedOptions: {},
            selectOption: jest.fn(),
            formattedPrice: '$10.00',
            isOutOfStock: true
        })

        render(
            <ImpulseSheet
                isOpen={true}
                onOpenChange={jest.fn()}
                product={mockProduct}
            />
        )

        expect(screen.getByText('Out of Stock')).toBeInTheDocument()
        expect(screen.queryByText('Add to Cart')).not.toBeInTheDocument()
    })
})
