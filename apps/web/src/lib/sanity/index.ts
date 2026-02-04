/**
 * Sanity Library Exports
 * Re-export all Sanity utilities from a single entry point
 */

// Configuration
export { sanityConfig } from './config'
export type { SanityConfig } from './config'

// Client and image utilities
export { sanityClient, urlForImage, getImageUrl } from './client'

// Queries and types
export {
    getProductAssets,
    getAllProducts,
    productByMedusaIdQuery,
    allProductsQuery,
} from './queries'
export type { SanityProductAssets } from './queries'
