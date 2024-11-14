import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import locationRoutes from "./routes/location.routes";
// import tradeRoutes from "./routes/trade.routes";
// import rentRoutes from "./routes/rent.routes";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middlewares
    this.app.use(helmet());  // 보안 헤더 설정
    this.app.use(compression());  // 응답 압축

    // CORS 설정
    const allowedOrigins = [
      "https://odigodi.com",
      "https://web-odigodi-frontend-ac2nlkqcdiye.sel4.cloudtype.app",
      "http://localhost:3000"
    ];

    this.app.use(cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true
    }));

    // Body parsing middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check route
    this.app.get("/health", (_req: Request, res: Response) => {
      res.status(200).send({
        status: "ok",
        timestamp: new Date().toISOString()
      });
    });

    // Welcome route
    this.app.get("/", (_req: Request, res: Response) => {
      res.json({ 
        message: "Welcome to odigodi backend.",
        version: "1.0.0",
        documentation: "/api-docs"  // TODO: for swagger later
      });
    });

    // API routes
    this.app.use("/api/locations", locationRoutes);
    // this.app.use("/api/trades", tradeRoutes);
    // this.app.use("/api/rents", rentRoutes);
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use((_req: Request, res: Response) => {
      res.status(404).send({
        success: false,
        message: "Route not found"
      });
    });

    // Global error handler
    this.app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      console.error(err.stack);
      res.status(500).send({
        success: false,
        message: "Something broke!",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });
  }
}

export default new App().app;