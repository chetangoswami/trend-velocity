'use server'

import Medusa from "@medusajs/medusa-js"

import { getProductsByMedusaIds } from "@/lib/sanity/queries"
import { FeedItem } from "./types"
import { urlForImage } from "@/lib/sanity/client"

// Use environment variable or default to local Medusa backend
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export async function getFeedProducts(page: number = 0, limit: number = 20): Promise<FeedItem[]> {
    // Initialize Medusa client
    const medusa = new Medusa({
        baseUrl: MEDUSA_BACKEND_URL,
        maxRetries: 3,
        publishableApiKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    })

    let products = []
    try {
        const { products: medusaProducts } = await medusa.products.list({
            limit,
            offset: page * limit,
            fields: "id,title,thumbnail,options,variants.id,variants.title,variants.prices,variants.options,variants.inventory_quantity"
        })
        products = medusaProducts
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.error("Failed to fetch products from Medusa:", (error as any)?.message || error)
        if ((error as any)?.response?.data) {
            console.error("Medusa API Error Details:", JSON.stringify((error as any).response.data, null, 2))
        }
        return []
    }

    // Fetch Sanity assets for ONLY the products we found
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const medusaIds = products.map((p: any) => p.id)
    const sanityProducts = await getProductsByMedusaIds(medusaIds)

    const feedItems: FeedItem[] = []

    for (const product of products) {
        // Find matching Sanity product by Medusa ID
        const sanityProduct = sanityProducts.find(sp => sp.medusaId === product.id)

        // Attach wearTestMedia to product object if available
        if (sanityProduct?.wearTestMedia && Array.isArray(sanityProduct.wearTestMedia)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (product as any).wearTestMedia = sanityProduct.wearTestMedia
                .filter((m: any) => m._type === 'image')
                .map((m: any) => urlForImage(m).url())
        }

        // Fallback if no Sanity data found (use Medusa thumbnail)
        if (!sanityProduct) {
            if (product.thumbnail) {
                feedItems.push({
                    id: `${product.id}_hero`,
                    type: 'product_hero',
                    mediaUrl: product.thumbnail, // Medusa thumbnail
                    mediaType: 'image',
                    product: product,
                })
            }
            continue
        }

        // 1. Add Hero Image (Product Hero)
        if (sanityProduct.heroImage) {
            feedItems.push({
                id: `${product.id}_hero`,
                type: 'product_hero',
                mediaUrl: urlForImage(sanityProduct.heroImage).url(),
                mediaType: 'image',
                product: product,
            })
        }

        // 2. Add Wear Test Media
        if (sanityProduct.wearTestMedia && Array.isArray(sanityProduct.wearTestMedia)) {
            sanityProduct.wearTestMedia.forEach((media, index) => {
                const mediaUrl = urlForImage(media).url()

                if (media._type === 'image') {
                    feedItems.push({
                        id: `${product.id}_wear_${index}`,
                        type: 'wear_test',
                        mediaUrl: mediaUrl,
                        mediaType: 'image',
                        product: product
                    })
                }
            })
        }
    }

    // Shuffle or simple reverse to show newest? Use as is for now.
    return feedItems
}
