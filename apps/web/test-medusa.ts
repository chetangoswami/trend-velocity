
import Medusa from "@medusajs/medusa-js"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

async function testExpand() {
    const medusa = new Medusa({
        baseUrl: MEDUSA_BACKEND_URL,
        maxRetries: 3,
        publishableApiKey: "pk_01JMJ2GGDH5M3HK8M8P99849E5" // Using a dummy or potentially the one from env if I could read it
    })

    console.log("Testing without expand...")
    try {
        const res1 = await medusa.products.list({ limit: 1 })
        console.log("Success without expand. IDs:", res1.products.map(p => p.id))
    } catch (e: any) {
        console.error("Error without expand:", e.message)
    }

    console.log("\nTesting expand: 'variants'...")
    try {
        const res2 = await medusa.products.list({ limit: 1, expand: "variants" })
        console.log("Success with 'variants'. Variants count:", res2.products[0]?.variants?.length)
    } catch (e: any) {
        console.error("Error with 'variants':", e.message)
    }

    console.log("\nTesting expand: 'variants,variants.prices'...")
    try {
        const res3 = await medusa.products.list({ limit: 1, expand: "variants,variants.prices" })
        console.log("Success with 'variants,variants.prices'. Prices found:", res3.products[0]?.variants?.[0]?.prices?.length)
    } catch (e: any) {
        console.error("Error with 'variants,variants.prices':", e.message)
    }
}

testExpand()
