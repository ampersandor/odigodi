import { Model, DataTypes, Sequelize, ModelStatic } from 'sequelize';

export interface RentAttributes {
  trade_ymd: string;
  offinm: string;
  excluusear: number;
  deposit: number;
  floor: number;
  location_id: string;
  monthlyrent: number;
}

export interface RentModel extends Model<RentAttributes>, RentAttributes {}

const initRentModel = (sequelize: Sequelize): ModelStatic<RentModel> => {
  const Rent = sequelize.define<RentModel>('officetel_rent', {
    trade_ymd: {
      type: DataTypes.DATE
    },
    offinm: {
      type: DataTypes.STRING
    },
    excluusear: {
      type: DataTypes.FLOAT
    },
    deposit: {
      type: DataTypes.INTEGER
    },
    floor: {
      type: DataTypes.INTEGER
    },
    location_id: {
      type: DataTypes.STRING
    },
    monthlyrent: {
      type: DataTypes.INTEGER
    }
  });

  return Rent;
}

export default initRentModel;