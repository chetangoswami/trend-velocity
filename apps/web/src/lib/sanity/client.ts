/**
 * Sanity Client
 * Pre-configured Sanity client for fetching content
 */

import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'
import { sanityConfig } from './config'

// Create the Sanity client
export const sanityClient = createClient({
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
    apiVersion: sanityConfig.apiVersion,
    useCdn: sanityConfig.useCdn,
})

// Image URL builder
const builder = createImageUrlBuilder(sanityClient)

// Type for Sanity image source
interface SanityImageAsset {
    _ref?: string
    _type?: string
    asset?: {
        _ref: string
        _type: 'reference'
    }
}

/**
 * Generate CDN URL for Sanity images
 * @param source - Sanity image reference
 * @returns Image URL builder for chaining
 */
export function urlForImage(source: SanityImageAsset) {
    return builder.image(source)
}

/**
 * Get optimized image URL with dimensions
 * @param source - Sanity image reference
 * @param width - Desired width
 * @param height - Optional height (maintains aspect ratio if omitted)
 * @returns CDN URL string
 */
export function getImageUrl(
    source: SanityImageAsset,
    width: number,
    height?: number
): string {
    let img = builder.image(source).width(width).auto('format').fit('max')
    if (height) {
        img = img.height(height)
    }
    return img.url()
}
