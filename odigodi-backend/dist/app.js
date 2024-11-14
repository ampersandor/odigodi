"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const location_routes_1 = __importDefault(require("./routes/location.routes"));
// import tradeRoutes from "./routes/trade.routes";
// import rentRoutes from "./routes/rent.routes";
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        // Security middlewares
        this.app.use((0, helmet_1.default)()); // 보안 헤더 설정
        this.app.use((0, compression_1.default)()); // 응답 압축
        // CORS 설정
        const allowedOrigins = [
            "https://web-odigodi-frontend-ac2nlkqcdiye.sel4.cloudtype.app",
            "http://localhost:3000"
        ];
        this.app.use((0, cors_1.default)({
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            credentials: true
        }));
        // Body parsing middlewares
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        // Request logging
        this.app.use((req, _res, next) => {
            console.log(`${req.method} ${req.path}`);
            next();
        });
    }
    initializeRoutes() {
        // Health check route
        this.app.get("/health", (_req, res) => {
            res.status(200).send({
                status: "ok",
                timestamp: new Date().toISOString()
            });
        });
        // Welcome route
        this.app.get("/", (_req, res) => {
            res.json({
                message: "Welcome to odigodi backend.",
                version: "1.0.0",
                documentation: "/api-docs" // 만약 Swagger를 사용한다면
            });
        });
        // API routes
        this.app.use("/api/locations", location_routes_1.default);
        // this.app.use("/api/trades", tradeRoutes);
        // this.app.use("/api/rents", rentRoutes);
    }
    initializeErrorHandling() {
        // 404 handler
        this.app.use((_req, res) => {
            res.status(404).send({
                success: false,
                message: "Route not found"
            });
        });
        // Global error handler
        this.app.use((err, _req, res, _next) => {
            console.error(err.stack);
            res.status(500).send({
                success: false,
                message: "Something broke!",
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        });
    }
}
exports.default = new App().app;
