import { Model, DataTypes, Sequelize, ModelStatic } from 'sequelize';

export interface TradeAttributes {
  trade_ymd: string;
  offinm: string;
  excluusear: number;
  dealamount: number;
  floor: number;
}

export interface TradeModel extends Model<TradeAttributes>, TradeAttributes {}

const initTradeModel = (sequelize: Sequelize): ModelStatic<TradeModel> => {
  const Trade = sequelize.define<TradeModel>('officetel_trade', {
    trade_ymd: {
      type: DataTypes.DATE
    },
    offinm: {
      type: DataTypes.STRING
    },    
    excluusear: {
      type: DataTypes.FLOAT
    },
    dealamount: {
      type: DataTypes.INTEGER
    },
    floor: {
      type: DataTypes.INTEGER
    }
  });

  return Trade;
}

export default initTradeModel;