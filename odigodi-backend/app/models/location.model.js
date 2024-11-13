module.exports = (sequelize, Sequelize) => {
    const Location = sequelize.define("officetel_location", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      offinm: {
        type: Sequelize.STRING,
      },
      lat: {
        type: Sequelize.FLOAT
      },
      lng: {
        type: Sequelize.FLOAT
      }
    }, {      // Disable the automatic pluralization of table name
      freezeTableName: true,
      // Prevent Sequelize from adding timestamps columns (createdAt, updatedAt)
      timestamps: false
    });
  
    return Location;
  };
  