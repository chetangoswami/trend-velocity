
import { FeedItem } from './types'

export const formatPrice = (currencyCode: string, amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
    }).format(amount / 100)
}

export const getProductPrice = (product: FeedItem['product']) => {
    if (product.variants?.[0]?.prices?.[0]) {
        return formatPrice(
            product.variants[0].prices[0].currency_code,
            product.variants[0].prices[0].amount
        )
    }
    return 'Price unavailable'
}

export const getProductDescription = (product: FeedItem['product']) => {
    return product.description || `Experience the future of ${product.title}. Premium quality, designed for you.`
}
