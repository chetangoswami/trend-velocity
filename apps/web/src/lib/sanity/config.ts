/**
 * Sanity Configuration
 * Central configuration for Sanity client used across the frontend
 */

export const sanityConfig = {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
    // Set to true for draft mode
    useCdn: process.env.NODE_ENV === 'production',
} as const

// Validate critical config
if (!sanityConfig.projectId) {
    console.warn('Sanity Project ID is missing. Please set NEXT_PUBLIC_SANITY_PROJECT_ID.')
}

export type SanityConfig = typeof sanityConfig
