import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

/**
 * Health check endpoint for deployment verification
 * Responds to GET /health with service status
 */
export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    res.status(200).json({
        status: "ok",
        service: "trend-velocity-backend",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
}
