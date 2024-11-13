module.exports = (sequelize, Sequelize) => {
    const Rent = sequelize.define("officetel_rent", {
      trade_ymd: {
        type: Sequelize.DATE
      },
      offinm: {
        type: Sequelize.STRING,
      },
      excluusear: {
        type: Sequelize.FLOAT
      },
      deposit: {
        type: Sequelize.INTEGER
      }
    });
    // Rent.removeAttribute('id');
  
    return Rent;
  };
  