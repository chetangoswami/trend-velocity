
import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows";

export default async function ({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    logger.info("Fixing product images...");

    // 1. Get All Products
    const { data: products } = await query.graph({
        entity: "product",
        fields: ["id", "handle"],
    });

    if (!products.length) {
        logger.info("No products found to update.");
        return;
    }

    const updates = [];

    for (const product of products) {
        let thumbnail = "";
        if (product.handle.includes("hoodie")) {
            thumbnail = "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80";
        } else if (product.handle.includes("visor")) {
            thumbnail = "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80";
        } else if (product.handle.includes("boots")) {
            thumbnail = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80";
        } else {
            thumbnail = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80";
        }

        updates.push({
            id: product.id,
            thumbnail: thumbnail,
            images: [{ url: thumbnail }]
        });
    }

    try {
        const { result } = await updateProductsWorkflow(container).run({
            input: {
                products: updates
            }
        });
        logger.info(`Successfully updated images for ${result.length} products`);
    } catch (error) {
        logger.error("Failed to update products: " + error);
    }
}
