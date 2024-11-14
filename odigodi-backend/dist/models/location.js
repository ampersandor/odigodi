"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const initLocationModel = (sequelize) => {
    const Location = sequelize.define('officetel_location', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true
        },
        offinm: {
            type: sequelize_1.DataTypes.STRING
        },
        lat: {
            type: sequelize_1.DataTypes.FLOAT
        },
        lng: {
            type: sequelize_1.DataTypes.FLOAT
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
    return Location;
};
exports.default = initLocationModel;
