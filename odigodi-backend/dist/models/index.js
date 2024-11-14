"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
const location_1 = __importDefault(require("./location"));
// import initRentModel from './rent.model';
// import initTradeModel from './trade.model';
const sequelize = new sequelize_1.Sequelize(db_config_1.default.DB, db_config_1.default.USER, db_config_1.default.PASSWORD, {
    host: db_config_1.default.HOST,
    port: db_config_1.default.PORT,
    dialect: db_config_1.default.dialect,
    define: {
        timestamps: false,
        freezeTableName: true
    },
    pool: {
        max: db_config_1.default.pool.max,
        min: db_config_1.default.pool.min,
        acquire: db_config_1.default.pool.acquire,
        idle: db_config_1.default.pool.idle
    }
});
const db = {
    Sequelize: sequelize_1.Sequelize,
    sequelize,
    location: (0, location_1.default)(sequelize),
    // rent: initRentModel(sequelize),
    // trade: initTradeModel(sequelize)
};
exports.default = db;
