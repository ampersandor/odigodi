import dotenv from "dotenv";
dotenv.config();

import { Dialect } from "sequelize";

// 환경 변수 타입 정의
interface DbConfigAttributes {
  HOST: string;
  USER: string;
  PORT: number;
  PASSWORD: string;
  DB: string;
  dialect: Dialect;
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

// 환경 변수에서 데이터 가져오기
const dbConfig: DbConfigAttributes = {
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

export default dbConfig;