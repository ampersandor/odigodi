import { Model, DataTypes, Sequelize, ModelStatic } from 'sequelize';

export interface LocationAttributes {
  id: string;  
  offinm: string;
  lat: number;
  lng: number;
}

export interface LocationModel extends Model<LocationAttributes>, LocationAttributes {}

const initLocationModel = (sequelize: Sequelize): ModelStatic<LocationModel> => {
  const Location = sequelize.define<LocationModel>('officetel_location', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    offinm: {
      type: DataTypes.STRING
    },
    lat: {
      type: DataTypes.FLOAT
    },
    lng: {
      type: DataTypes.FLOAT
    }
  }, {
    timestamps: false,
    freezeTableName: true
  });

  return Location;
};

export default initLocationModel;