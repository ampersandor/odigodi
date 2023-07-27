const db = require("../models");
const Rent = db.rent;
const Op = db.Sequelize.Op;


exports.findByName = (req, res) => {
  const name = req.params.name;

  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
  
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
