module.exports = app => {
    const rent = require("../controllers/rent.controller.js");
  
    var router = require("express").Router();
  
    router.get("/:name", rent.findByName);
    
    app.use("/api/rent", router);
  };
  