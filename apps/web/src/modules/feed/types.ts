export type FeedItemType = 'product_hero' | 'wear_test'

// Minimal Medusa Product Interface for Feed
export interface ProductVariant {
    id: string
    title: string
    prices: {
        amount: number
        currency_code: string
    }[]
    options?: {
        id: string
        value: string
    }[]
    inventory_quantity?: number
}

export interface Product {
    id: string
    title: string
    description: string | null
    thumbnail: string | null
    variants: ProductVariant[]
    options: {
        id: string
        title: string
        values: { value: string }[]
    }[]
    wearTestMedia?: string[]
}

export interface FeedItem {
    id: string
    type: FeedItemType
    mediaUrl: string
    mediaType: 'image' | 'video'
    width?: number
    height?: number
    aspectRatio?: number
    product: Product
    priority?: boolean
}

export interface FeedState {
    currentIndex: number
    direction: 'up' | 'down'
}
