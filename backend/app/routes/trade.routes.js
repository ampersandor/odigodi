module.exports = app => {
  const trade = require("../controllers/trade.controller.js");

  var router = require("express").Router();

  router.get("/:name", trade.findByName);

  app.use("/api/trade", router);
};
