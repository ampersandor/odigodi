module.exports = (sequelize, Sequelize) => {
    const Rent = sequelize.define("rent", {
      trade_ymd: {
        type: Sequelize.DATE
      },
      name: {
        type: Sequelize.STRING,
      },
      area: {
        type: Sequelize.FLOAT
      },
      deposite: {
        type: Sequelize.FLOAT
      }
    });
    Rent.removeAttribute('id');
  
    return Rent;
  };
  