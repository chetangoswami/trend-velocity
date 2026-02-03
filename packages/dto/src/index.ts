/**
 * Shared DTO types for Trend Velocity
 * This package has ZERO runtime dependencies per architecture requirements.
 */

// Product types
export interface ProductDTO {
    id: string;
    title: string;
    handle: string;
    description?: string;
    thumbnail?: string;
    price: number;
    originalPrice?: number;
    currencyCode: string;
}

// Collection types
export interface CollectionDTO {
    id: string;
    title: string;
    handle: string;
    products?: ProductDTO[];
}

// Cart types
export interface CartItemDTO {
    id: string;
    productId: string;
    variantId: string;
    quantity: number;
    unitPrice: number;
    title: string;
    thumbnail?: string;
}

export interface CartDTO {
    id: string;
    items: CartItemDTO[];
    subtotal: number;
    total: number;
    currencyCode: string;
}

// Trend Campaign types
export interface TrendCampaignDTO {
    id: string;
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
    };
    startDate: string;
    endDate: string;
    active: boolean;
}
