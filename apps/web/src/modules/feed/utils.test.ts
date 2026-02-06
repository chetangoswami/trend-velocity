import { formatPrice, getProductPrice, getProductDescription } from './utils'
import { Product } from './types'

describe('utils', () => {
    describe('formatPrice', () => {
        it('formats USD price correctly', () => {
            expect(formatPrice('usd', 1000)).toBe('$10.00')
        })

        it('formats cents correctly', () => {
            expect(formatPrice('usd', 99)).toBe('$0.99')
        })

        it('formats EUR price correctly', () => {
            expect(formatPrice('eur', 2500)).toBe('€25.00')
        })

        it('formats large amounts with commas', () => {
            expect(formatPrice('usd', 100000)).toBe('$1,000.00')
        })
    })

    describe('getProductPrice', () => {
        it('returns formatted price from first variant', () => {
            const product: Product = {
                id: '1',
                title: 'Test',
                description: null,
                thumbnail: null,
                options: [],
                variants: [{
                    id: 'v1',
                    title: 'Default',
                    prices: [{ amount: 4999, currency_code: 'usd' }]
                }]
            }
            expect(getProductPrice(product)).toBe('$49.99')
        })

        it('returns "Price unavailable" when no variants', () => {
            const product: Product = {
                id: '1',
                title: 'Test',
                description: null,
                thumbnail: null,
                options: [],
                variants: []
            }
            expect(getProductPrice(product)).toBe('Price unavailable')
        })

        it('returns "Price unavailable" when variant has no prices', () => {
            const product: Product = {
                id: '1',
                title: 'Test',
                description: null,
                thumbnail: null,
                options: [],
                variants: [{
                    id: 'v1',
                    title: 'Default',
                    prices: []
                }]
            }
            expect(getProductPrice(product)).toBe('Price unavailable')
        })
    })

    describe('getProductDescription', () => {
        it('returns product description when available', () => {
            const product: Product = {
                id: '1',
                title: 'Test Shoes',
                description: 'Custom description here',
                thumbnail: null,
                options: [],
                variants: []
            }
            expect(getProductDescription(product)).toBe('Custom description here')
        })

        it('returns generated description when description is null', () => {
            const product: Product = {
                id: '1',
                title: 'Test Shoes',
                description: null,
                thumbnail: null,
                options: [],
                variants: []
            }
            expect(getProductDescription(product)).toBe(
                'Experience the future of Test Shoes. Premium quality, designed for you.'
            )
        })

        it('returns generated description when description is empty string', () => {
            const product: Product = {
                id: '1',
                title: 'Jacket',
                description: '',
                thumbnail: null,
                options: [],
                variants: []
            }
            // Empty string is falsy, so fallback is used
            expect(getProductDescription(product)).toBe(
                'Experience the future of Jacket. Premium quality, designed for you.'
            )
        })
    })
})
