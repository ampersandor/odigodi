require('dotenv').config()

module.exports = {
  HOST: process.env.psql_host,
  USER: process.env.psql_user,
  PORT: process.env.psql_port,
  PASSWORD: process.env.psql_pwd,
  DB: process.env.psql_db,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

console.log(process.env.psql_host)
console.log(process.env.psql_port)
// config/db.config.js 
// models/location.model.js
// models/index.js
// controllers/locatin.controller.js
// routes/location.routes.js