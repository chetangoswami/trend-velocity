import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

/**
 * Health check endpoint for deployment verification
 * Responds to GET /health with service status
 * Includes database connectivity check for accurate health reporting
 */
export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    try {
        // Attempt lightweight DB query to verify connectivity
        const query = req.scope.resolve("__pg_connection__");
        if (query?.raw) {
            await query.raw("SELECT 1");
        }

        res.status(200).json({
            status: "ok",
            service: "trend-velocity-backend",
            database: "connected",
            timestamp: new Date().toISOString(),
            version: "1.0.0",
        });
    } catch (error) {
        res.status(503).json({
            status: "unhealthy",
            service: "trend-velocity-backend",
            database: "disconnected",
            timestamp: new Date().toISOString(),
            version: "1.0.0",
        });
    }
}
