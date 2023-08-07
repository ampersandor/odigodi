module.exports = (sequelize, Sequelize) => {
    const Location = sequelize.define("location", {
      name: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      lat: {
        type: Sequelize.FLOAT
      },
      lng: {
        type: Sequelize.FLOAT
      }
    });
  
    return Location;
  };
  