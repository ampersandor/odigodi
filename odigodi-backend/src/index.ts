import dotenv from "dotenv";
import { Server } from "http";
import app from "./app";
import db from "./models";

class ServerBootstrap {
  private server: Server | null = null;

  constructor() {
    // Load environment variables
    dotenv.config();
    this.validateEnv();
  }

  private validateEnv(): void {
    const requiredEnvVars = ['PORT', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }
  }

  public async start(): Promise<void> {
    try {
      await db.sequelize.sync();
      console.log("🔄 Database synchronized successfully.");

      const PORT = process.env.PORT || 8082;

      this.server = app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📚 Environment: ${process.env.NODE_ENV}`);
        console.log(`🔗 Database connected successfully`);
      });

      // Handle server shutdown
      this.handleShutdown();

    } catch (error) {
      console.error("💥 Failed to start server:", error);
      process.exit(1);
    }
  }

  private handleShutdown(): void {
    const shutdown = async () => {
      console.log('\n🔄 Received shutdown signal...');
      
      if (this.server) {
        this.server.close(() => {
          console.log('😪 HTTP server closed');
        });
      }
      try {
        await db.sequelize.close();
        console.log('💤 Database connection closed');
        process.exit(0);
      } catch (err) {
        console.error('💥 Error during shutdown:', err);
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
  console.error("💥 Failed to start server:", error);
  process.exit(1);
});