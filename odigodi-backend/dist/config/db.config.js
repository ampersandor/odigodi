"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 환경 변수에서 데이터 가져오기
const dbConfig = {
    HOST: process.env.DB_HOST || "localhost",
    USER: process.env.DB_USER || "username",
    PORT: Number(process.env.DB_PORT) || 5432,
    PASSWORD: process.env.DB_PASSWORD || "password",
    DB: process.env.DB_NAME || "database_name",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
exports.default = dbConfig;
