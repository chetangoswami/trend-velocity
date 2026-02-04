const { loadEnv, Modules, defineConfig } = require("@medusajs/framework/utils");

// Load environment variables
loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        databaseDriverOptions: {
            connection: {
                ssl: {
                    rejectUnauthorized: false,
                },
            },
        },
        redisUrl: process.env.REDIS_URL,
        http: {
            storeCors: process.env.STORE_CORS || "http://localhost:3000",
            adminCors: process.env.ADMIN_CORS || "http://localhost:3000",
            authCors: process.env.AUTH_CORS || "http://localhost:3000",
        },
    },
    admin: {
        disable: false,
        path: "/dashboard",
    },
    modules: {
        // [Modules.CACHE]: {
        //     resolve: "@medusajs/cache-redis",
        //     options: {
        //         redisUrl: process.env.REDIS_URL,
        //     },
        // },
        // [Modules.EVENT_BUS]: {
        //     resolve: "@medusajs/event-bus-redis",
        //     options: {
        //         redisUrl: process.env.REDIS_URL,
        //     },
        // },
    },
});
