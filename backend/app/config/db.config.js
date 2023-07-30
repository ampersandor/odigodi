module.exports = {
  HOST: "localhost",
  USER: "airflow",
  PASSWORD: "airflow",
  DB: "odigodi",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// config/db.config.js 
// models/location.model.js
// models/index.js
// controllers/locatin.controller.js
// routes/location.routes.js