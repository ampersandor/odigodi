const db = require("../models");
const Trade = db.trade;
const Op = db.Sequelize.Op;


exports.findByName = (req, res) => {
  const name = req.params.name;
  
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Trade.findAll({ where: condition })
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
