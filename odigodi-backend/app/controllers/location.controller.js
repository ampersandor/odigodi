const db = require("../models");
const Location = db.location;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const location = {
    offinm: req.body.offinm,
    lat: req.body.lat,
    lng: req.body.lng
  };

  Location.create(location)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Location."
      });
    });
};

exports.findAll = (req, res) => {
  Location.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving location."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Location.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Location with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Location with id=" + id
      });
    });
};