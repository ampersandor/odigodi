const db = require("../models");
const Rent = db.rent;
const Op = db.Sequelize.Op;


exports.findByName = (req, res) => {
  const offinm = req.params.name;

  var condition = offinm ? { offinm: { [Op.iLike]: `%${offinm}%` } } : null;
  
  Rent.findAll({ where: condition })
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
