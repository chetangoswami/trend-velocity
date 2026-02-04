
import { ExecArgs } from "@medusajs/framework/types";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";

export default async function ({ container }: ExecArgs) {
    const logger = container.resolve("logger");

    const products = [
        {
            title: "Neon Genesis Hoodie",
            subtitle: "Limited Edition",
            description: "High-quality cotton hoodie with neon accents.",
            handle: "neon-genesis-hoodie",
            status: "published",
            thumbnail: "https://pub-4569e4e5d557441e896fc4ed5f345253.r2.dev/fashion/hoodie.webp",
            images: [
                { url: "https://pub-4569e4e5d557441e896fc4ed5f345253.r2.dev/fashion/hoodie.webp" },
                { url: "https://pub-4569e4e5d557441e896fc4ed5f345253.r2.dev/fashion/hoodie-back.webp" }
            ],
            options: [
                {
                    title: "Size",
                    values: ["S", "M", "L", "XL"]
                }
            ],
            variants: [
                {
                    title: "S",
                    sku: "NGH-S",
                    prices: [
                        {
                            currency_code: "usd",
                            amount: 120
                        }
                    ],
                    options: {
                        "Size": "S"
                    }
                },
                {
                    title: "M",
                    sku: "NGH-M",
                    prices: [
                        {
                            currency_code: "usd",
                            amount: 120
                        }
                    ],
                    options: {
                        "Size": "M"
                    }
                }
            ]
        },
        {
            title: "Cyberpunk Visor",
            subtitle: "Accessory",
            description: "Futuristic visor with HUD display mockup.",
            handle: "cyberpunk-visor",
            status: "published",
            thumbnail: "https://pub-4569e4e5d557441e896fc4ed5f345253.r2.dev/fashion/visor.webp",
            images: [
                { url: "https://pub-4569e4e5d557441e896fc4ed5f345253.r2.dev/fashion/visor.webp" }
            ],
            options: [
                {
                    title: "Color",
                    values: ["Black", "Silver"]
                }
            ],
            variants: [
                {
                    title: "Black",
                    sku: "CV-BLK",
                    prices: [
                        {
                            currency_code: "usd",
                            amount: 45
                        }
                    ],
                    options: {
                        "Color": "Black"
                    }
                }
            ]
        },
        {
            title: "Gravity Boots",
            subtitle: "Footwear",
            description: "Anti-gravity boots for moonwalking on earth.",
            handle: "gravity-boots",
            status: "published",
            thumbnail: "https://pub-4569e4e5d557441e896fc4ed5f345253.r2.dev/fashion/boots.webp",
            images: [
                { url: "https://pub-4569e4e5d557441e896fc4ed5f345253.r2.dev/fashion/boots.webp" }
            ],
            options: [
                {
                    title: "Size",
                    values: ["9", "10", "11"]
                }
            ],
            variants: [
                {
                    title: "10",
                    sku: "GB-10",
                    prices: [
                        {
                            currency_code: "usd",
                            amount: 250
                        }
                    ],
                    options: {
                        "Size": "10"
                    }
                }
            ]
        }
    ];

    logger.info("Seeding products...");

    try {
        const { result } = await createProductsWorkflow(container).run({
            input: {
                products
            }
        });
        logger.info(`Successfully seeded ${result.length} products`);
    } catch (e) {
        logger.error("Failed to seed products: " + e);
        console.error(e);
    }
}
