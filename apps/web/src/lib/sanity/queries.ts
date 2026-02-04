/**
 * Sanity GROQ Queries
 * Centralized queries for fetching product content from Sanity
 */

import { sanityClient } from './client'

// Types for Sanity product data
export interface SanityProductAssets {
    _id: string
    medusaId: string
    title?: string
    heroImage?: {
        _type: 'image'
        asset: {
            _ref: string
            _type: 'reference'
        }
        hotspot?: {
            x: number
            y: number
            height: number
            width: number
        }
    }
    wearTestMedia?: Array<{
        _type: 'image' | 'file'
        _key: string
        asset: {
            _ref: string
            _type: 'reference'
        }
        alt?: string
        caption?: string
    }>
}

// GROQ Queries

/**
 * Fetch product assets by Medusa product ID
 */
export const productByMedusaIdQuery = `*[_type == "product" && medusaId == $medusaId][0]{
  _id,
  medusaId,
  title,
  heroImage,
  wearTestMedia
}`

/**
 * Fetch all products (for listing)
 */
export const allProductsQuery = `*[_type == "product"]{
  _id,
  medusaId,
  title,
  heroImage,
  wearTestMedia
}`

// Fetch functions

/**
 * Get Sanity product assets by Medusa product ID
 * @param medusaId - Medusa product ID (e.g., "prod_01ABC123")
 * @returns Product assets or null if not found
 */
export async function getProductAssets(
    medusaId: string
): Promise<SanityProductAssets | null> {
    try {
        const product = await sanityClient.fetch<SanityProductAssets | null>(
            productByMedusaIdQuery,
            { medusaId }
        )
        return product
    } catch (error) {
        console.error(`Failed to fetch Sanity assets for product ${medusaId}:`, error)
        return null
    }
}

/**
 * Get all Sanity products
 * @returns Array of products with basic info
 */
export async function getAllProducts(): Promise<SanityProductAssets[]> {
    try {
        const products = await sanityClient.fetch<SanityProductAssets[]>(allProductsQuery)
        return products || []
    } catch (error) {
        console.error('Failed to fetch Sanity products:', error)
        return []
    }
}

/**
 * Fetch specific products by their Medusa IDs
 * @param medusaIds - Array of Medusa product IDs
 */
export const productsByMedusaIdsQuery = `*[_type == "product" && medusaId in $medusaIds]{
  _id,
  medusaId,
  title,
  heroImage,
  wearTestMedia
}`

export async function getProductsByMedusaIds(medusaIds: string[]): Promise<SanityProductAssets[]> {
    try {
        const products = await sanityClient.fetch<SanityProductAssets[]>(
            productsByMedusaIdsQuery,
            { medusaIds }
        )
        return products || []
    } catch (error) {
        console.error('Failed to fetch Sanity products by IDs:', error)
        return []
    }
}
