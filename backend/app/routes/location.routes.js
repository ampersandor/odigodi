module.exports = app => {
  const location = require("../controllers/location.controller.js");

  var router = require("express").Router();

  router.get("/", location.findAll);

  router.get("/:id", location.findOne);

  app.use("/api/location", router);
};
