const db = require("../models");
const Rent = db.rent;
const Op = db.Sequelize.Op;


exports.findByName = (req, res) => {
  const offinm = req.params.name;

  var condition = offinm 
  ? { 
      offinm: { [Op.iLike]: `%${offinm}%` },
      monthlyrent: 0  // 월세가 0인 조건 추가
    } 
  : { monthlyrent: 0 };  // 이름 검색이 없을 때도 월세 0인 조건 적용


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
