export type FeedItemType = 'product_hero' | 'wear_test'

export interface FeedItem {
    id: string
    type: FeedItemType
    mediaUrl: string
    mediaType: 'image' | 'video'
    width?: number
    height?: number
    aspectRatio?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product: any
    priority?: boolean // For LCP
}

export interface FeedState {
    currentIndex: number
    direction: 'up' | 'down'
}
