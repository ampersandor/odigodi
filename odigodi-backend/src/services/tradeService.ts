import { TradeModel } from "../models/trade";
import db from "../models";

class TradeService {
    async findByName(name: string): Promise<TradeModel[]> {
        try {
            return await db.trade.findAll({ where: { offinm: name }, order: [['trade_ymd', 'ASC']] });
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Error occurred while retrieving trade.");
        }
    }
    async findByLocationId(location_id: string): Promise<TradeModel[]> {
        try {
            return await db.trade.findAll({ where: { location_id: location_id }, order: [['trade_ymd', 'ASC']] });
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Error occurred while retrieving trade.");
        }
    }
}

export default new TradeService();