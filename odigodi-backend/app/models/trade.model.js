module.exports = (sequelize, Sequelize) => {
    const Trade = sequelize.define("officetel_trade", {
      trade_ymd: {
        type: Sequelize.DATE
      },
      offinm: {
        type: Sequelize.STRING,
      },
      excluusear: {
        type: Sequelize.FLOAT
      },
      dealamount: {
        type: Sequelize.INTEGER
      }
    });
    // Trade.removeAttribute('id');
  
    return Trade;
  };
  