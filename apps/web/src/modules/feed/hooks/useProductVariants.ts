import { useState, useEffect, useMemo } from 'react'
import { Product, ProductVariant } from '../types'
import { formatPrice } from '../utils'

export const useProductVariants = (product: Product | null | undefined) => {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>()
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

    // Initialize default variant
    useEffect(() => {
        // Find first in-stock variant, or default to first
        // If no variants, do nothing (undefined)
        if (!product?.variants?.length) {
            setSelectedVariant(undefined)
            setSelectedOptions({})
            return
        }

        const defaultVariant = product.variants.find(v => (v.inventory_quantity || 0) > 0) || product.variants[0]

        setSelectedVariant(defaultVariant)

        // Initialize options from default variant
        if (defaultVariant.options) {
            const options: Record<string, string> = {}
            defaultVariant.options.forEach(opt => {
                options[opt.id] = opt.value
            })
            setSelectedOptions(options)
        }
    }, [product])

    const selectOption = (optionId: string, value: string) => {
        if (!product?.variants) return

        const newOptions = { ...selectedOptions, [optionId]: value }
        setSelectedOptions(newOptions)

        // Find variant matching ALL options
        const match = product.variants.find(v => {
            if (!v.options) return false // Should technically not happen if data is consistent
            // Check if every option in the variant matches the selected options
            // Note: Use the variant's options to look up into newOptions
            return v.options.every(opt => newOptions[opt.id] === opt.value)
        })

        if (match) {
            setSelectedVariant(match)
        }
    }

    const formattedPrice = useMemo(() => {
        if (!selectedVariant?.prices?.[0]) return ''
        return formatPrice(selectedVariant.prices[0].currency_code, selectedVariant.prices[0].amount)
    }, [selectedVariant])

    // Treat undefined/null inventory as out of stock (defensive - better to show OOS than oversell)
    const isOutOfStock = (selectedVariant?.inventory_quantity ?? 0) <= 0

    return {
        selectedVariant,
        selectedOptions,
        selectOption,
        formattedPrice,
        isOutOfStock
    }
}
