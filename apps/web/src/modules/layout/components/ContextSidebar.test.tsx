import { render, screen } from '@testing-library/react'
import { ContextSidebar } from './ContextSidebar'

describe('ContextSidebar', () => {
    it('renders placeholder when no product is selected', () => {
        render(<ContextSidebar product={null} />)
        expect(screen.getByText('Select an item to view details')).toBeInTheDocument()
    })

    it('renders product details when product is provided', () => {
        const mockProduct = {
            id: '1',
            title: 'Test Product',
            description: 'Test Description',
            thumbnail: null,
            variants: [{
                id: 'v1',
                title: 'Default',
                prices: [{
                    amount: 9900,
                    currency_code: 'usd'
                }],
                inventory_quantity: 10 // Required for "Add to Cart" to show (not out of stock)
            }],
            options: []
        }
        render(<ContextSidebar product={mockProduct} />)

        expect(screen.getByText('Test Product')).toBeInTheDocument()
        expect(screen.getByText('$99.00')).toBeInTheDocument()
        expect(screen.getByText('Test Description')).toBeInTheDocument()
        expect(screen.getByText('Add to Cart')).toBeInTheDocument()

        // Verify buttons are clickable (even if no-op for now)
        const addToCartBtn = screen.getByText('Add to Cart')
        const saveBtn = screen.getByText('Save for Later')

        expect(addToCartBtn).toBeEnabled()
        expect(saveBtn).toBeEnabled()

        // Safety check that clicking doesn't crash
        addToCartBtn.click()
        saveBtn.click()
    })
})
