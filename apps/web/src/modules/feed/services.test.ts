import { getFeedProducts } from './services'
import { getProductsByMedusaIds } from '@/lib/sanity/queries'
import Medusa from '@medusajs/medusa-js'


// Mocks
jest.mock('@medusajs/medusa-js')
jest.mock('@/lib/sanity/queries')
jest.mock('@/lib/sanity/client', () => ({
    urlForImage: jest.fn().mockReturnValue({ url: jest.fn().mockReturnValue('http://mock-url.com/image.jpg') })
}))

describe('getFeedProducts', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should return combined feed items from Medusa and Sanity containing hero images', async () => {
        // 1. Mock Medusa Products
        const mockMedusaProducts = [
            { id: 'prod_1', title: 'Product 1' },
            { id: 'prod_2', title: 'Product 2' }
        ]
        const mockMedusaList = jest.fn().mockResolvedValue({ products: mockMedusaProducts })

            // Mock the constructor return value
            ; (Medusa as unknown as jest.Mock).mockImplementation(() => ({
                products: { list: mockMedusaList }
            }))

        // 2. Mock Sanity Products
        const mockSanityProducts = [
            // Matched product with Hero Image
            {
                medusaId: 'prod_1',
                heroImage: { _type: 'image', asset: { _ref: 'img-ref-1' } },
                wearTestMedia: []
            },
            // Matched product with NO media (should be skipped or handled?)
            {
                medusaId: 'prod_2',
                // No hero, no media
            }
        ]
            ; (getProductsByMedusaIds as jest.Mock).mockResolvedValue(mockSanityProducts)

        // 3. Execute
        const result = await getFeedProducts()

        // 4. Verify
        // Should have 1 item from prod_1 (Hero)
        expect(result).toHaveLength(1)

        const heroItem = result[0]
        expect(heroItem.id).toBe('prod_1_hero')
        expect(heroItem.type).toBe('product_hero')
        expect(heroItem.mediaUrl).toBe('http://mock-url.com/image.jpg')
        expect(heroItem.product.id).toBe('prod_1')
    })

    it('should include wear test media items', async () => {
        // Mock Medusa
        const mockMedusaList = jest.fn().mockResolvedValue({
            products: [{ id: 'prod_1' }]
        })
            ; (Medusa as unknown as jest.Mock).mockImplementation(() => ({
                products: { list: mockMedusaList }
            }))

            // Mock Sanity
            ; (getProductsByMedusaIds as jest.Mock).mockResolvedValue([
                {
                    medusaId: 'prod_1',
                    heroImage: null, // No hero
                    wearTestMedia: [
                        { _type: 'image', asset: { _ref: 'img-1' } },
                        { _type: 'image', asset: { _ref: 'img-2' } }
                    ]
                }
            ])

        const result = await getFeedProducts()

        expect(result).toHaveLength(2)
        expect(result[0].type).toBe('wear_test')
        expect(result[0].id).toBe('prod_1_wear_0')
        expect(result[1].type).toBe('wear_test')
        expect(result[1].id).toBe('prod_1_wear_1')
    })

    it('should handle errors gracefully from Medusa', async () => {
        const mockMedusaList = jest.fn().mockRejectedValue(new Error('Network error'))
            ; (Medusa as unknown as jest.Mock).mockImplementation(() => ({
                products: { list: mockMedusaList }
            }))

        const result = await getFeedProducts()
        expect(result).toEqual([]) // Should return empty array
    })
})
