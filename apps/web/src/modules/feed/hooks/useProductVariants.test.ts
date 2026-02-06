import { renderHook, act } from '@testing-library/react'
import { useProductVariants } from './useProductVariants'
import { Product } from '../types'

const mockProduct: Product = {
    id: 'prod_1',
    title: 'Test Product',
    description: 'Desc',
    thumbnail: 'thumb.jpg',
    options: [
        { id: 'opt_size', title: 'Size', values: [{ value: 'Small' }, { value: 'Large' }] },
        { id: 'opt_color', title: 'Color', values: [{ value: 'Red' }] }
    ],
    variants: [
        {
            id: 'var_1',
            title: 'Small / Red',
            prices: [{ amount: 1000, currency_code: 'usd' }],
            options: [
                { id: 'opt_size', value: 'Small' },
                { id: 'opt_color', value: 'Red' }
            ],
            inventory_quantity: 5
        },
        {
            id: 'var_2',
            title: 'Large / Red',
            prices: [{ amount: 1500, currency_code: 'usd' }],
            options: [
                { id: 'opt_size', value: 'Large' },
                { id: 'opt_color', value: 'Red' }
            ],
            inventory_quantity: 0 // Out of stock
        }
    ]
}

describe('useProductVariants', () => {
    it('should select the first in-stock variant by default', () => {
        const { result } = renderHook(() => useProductVariants(mockProduct))

        expect(result.current.selectedVariant?.id).toBe('var_1')
        expect(result.current.formattedPrice).toBe('$10.00')
        expect(result.current.isOutOfStock).toBe(false)
    })

    it('should allow selecting options to change variant', () => {
        const { result } = renderHook(() => useProductVariants(mockProduct))

        // Initial state
        expect(result.current.selectedOptions).toEqual({
            'opt_size': 'Small',
            'opt_color': 'Red'
        })

        // Change size to Large
        act(() => {
            result.current.selectOption('opt_size', 'Large')
        })

        expect(result.current.selectedVariant?.id).toBe('var_2')
        expect(result.current.formattedPrice).toBe('$15.00')
        expect(result.current.isOutOfStock).toBe(true)
        expect(result.current.selectedOptions).toEqual({
            'opt_size': 'Large',
            'opt_color': 'Red'
        })
    })

    it('should handle product with no variants gracefully', () => {
        const noVarProduct: Product = { ...mockProduct, variants: [] }
        const { result } = renderHook(() => useProductVariants(noVarProduct))

        expect(result.current.selectedVariant).toBeUndefined()
        expect(result.current.formattedPrice).toBe('')
    })
})
