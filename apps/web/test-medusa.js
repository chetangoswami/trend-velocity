
const Medusa = require("@medusajs/medusa-js").default || require("@medusajs/medusa-js");

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

async function testExpand() {
    const medusa = new Medusa({
        baseUrl: MEDUSA_BACKEND_URL,
        maxRetries: 3
    })

    console.log("Testing without expand...")
    try {
        const res1 = await medusa.products.list({ limit: 1 })
        console.log("Success without expand. IDs:", res1.products.map(p => p.id))
    } catch (e) {
        console.error("Error without expand:", e.message)
    }

    console.log("\nTesting fields: '*variants'...")
    try {
        // @ts-ignore
        const res2 = await medusa.products.list({ limit: 1, fields: "*variants" })
        console.log("Success with fields '*variants'. Variants count:", res2.products[0]?.variants?.length)
    } catch (e) {
        console.error("Error with fields '*variants':", e.message)
        if (e.response?.data) console.error(JSON.stringify(e.response.data, null, 2))
    }

    console.log("\nTesting fields: '*variants,*variants.prices'...")
    try {
        // @ts-ignore
        const res3 = await medusa.products.list({ limit: 1, fields: "*variants,*variants.prices" })
        console.log("Success with fields '*variants,*variants.prices'. Prices found:", res3.products[0]?.variants?.[0]?.prices?.length)
    } catch (e) {
        console.error("Error with fields '*variants,*variants.prices':", e.message)
        if (e.response?.data) console.error(JSON.stringify(e.response.data, null, 2))
    }
}

testExpand()
