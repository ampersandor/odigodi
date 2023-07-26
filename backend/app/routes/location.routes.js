module.exports = app => {
  const location = require("../controllers/location.controller.js");

  var router = require("express").Router();

  // Retrieve all Tutorials
  router.get("/", location.findAll);

  // Retrieve a single Tutorial with id
  router.get("/:id", location.findOne);

  app.use("/api/location", router);
};
