import { Sequelize } from 'sequelize';
import dbConfig from '../config/db.config';
import initLocationModel from './location';
import initRentModel from './rent';
import initTradeModel from './trade';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  define: {
    timestamps: false,
    freezeTableName: true
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {
  Sequelize,
  sequelize,
  location: initLocationModel(sequelize),
  rent: initRentModel(sequelize),
  trade: initTradeModel(sequelize)
};

export default db;