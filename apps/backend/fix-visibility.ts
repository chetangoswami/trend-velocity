
import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { remoteLink } from "@medusajs/framework/modules-sdk";

export default async function ({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    logger.info("Fixing product visibility...");

    // 1. Get Default Sales Channel
    const { data: salesChannels } = await query.graph({
        entity: "sales_channel",
        fields: ["id", "name"],
    });

    if (!salesChannels.length) {
        logger.error("No sales channels found!");
        return;
    }

    const defaultChannel = salesChannels[0];
    logger.info(`Using Sales Channel: ${defaultChannel.name} (${defaultChannel.id})`);

    // 2. Get All Products
    const { data: products } = await query.graph({
        entity: "product",
        fields: ["id", "title"],
    });

    if (!products.length) {
        logger.info("No products found to link.");
        return;
    }

    logger.info(`Found ${products.length} products. Linking to sales channel...`);

    // 3. Link Products to Sales Channel
    const links = products.map((product) => ({
        [Modules.PRODUCT]: { product_id: product.id },
        [Modules.SALES_CHANNEL]: { sales_channel_id: defaultChannel.id },
    }));

    try {
        await remoteLink.create(links);
        logger.info(`Successfully linked ${products.length} products to ${defaultChannel.name}`);
    } catch (error) {
        logger.error("Failed to link products: " + error);
    }
}
