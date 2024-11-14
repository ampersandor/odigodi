"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const models_1 = __importDefault(require("./models"));
class ServerBootstrap {
    constructor() {
        this.server = null;
        // Load environment variables
        dotenv_1.default.config();
        this.validateEnv();
    }
    validateEnv() {
        const requiredEnvVars = ['PORT', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
        for (const envVar of requiredEnvVars) {
            if (!process.env[envVar]) {
                throw new Error(`Missing required environment variable: ${envVar}`);
            }
        }
    }
    async start() {
        try {
            // Database synchronization
            await models_1.default.sequelize.sync();
            console.log("Database synchronized successfully.");
            const PORT = process.env.PORT || 8082;
            // Start server
            this.server = app_1.default.listen(PORT, () => {
                console.log(`🚀 Server is running on port ${PORT}`);
                console.log(`📚 Environment: ${process.env.NODE_ENV}`);
                console.log(`🔗 Database connected successfully`);
            });
            // Handle server shutdown
            this.handleShutdown();
        }
        catch (error) {
            console.error("Failed to start server:", error);
            process.exit(1);
        }
    }
    handleShutdown() {
        const shutdown = async () => {
            console.log('\nReceived shutdown signal...');
            if (this.server) {
                this.server.close(() => {
                    console.log('HTTP server closed');
                });
            }
            try {
                await models_1.default.sequelize.close();
                console.log('Database connection closed');
                process.exit(0);
            }
            catch (err) {
                console.error('Error during shutdown:', err);
                process.exit(1);
            }
        };
        // Handle different shutdown signals
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    }
}
// Start the server
const server = new ServerBootstrap();
server.start().catch(error => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
