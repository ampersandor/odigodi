module.exports = (sequelize, Sequelize) => {
    const Trade = sequelize.define("trade", {
      trade_ymd: {
        type: Sequelize.DATE
      },
      name: {
        type: Sequelize.STRING,
      },
      area: {
        type: Sequelize.FLOAT
      },
      price: {
        type: Sequelize.FLOAT
      }
    });
    Trade.removeAttribute('id');
  
    return Trade;
  };
  