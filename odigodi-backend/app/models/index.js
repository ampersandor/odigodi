const dbConfig = require("../config/db.config.js");
console.log(dbConfig)
const Sequelize = require("sequelize");
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

console.log(dbConfig.PORT)

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.location = require("./location.model.js")(sequelize, Sequelize);
db.rent = require("./rent.model.js")(sequelize, Sequelize);
db.trade = require("./trade.model.js")(sequelize, Sequelize);

module.exports = db;
