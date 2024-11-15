import { RentModel } from "../models/rent";
import db from "../models";

class RentService {
    async findByName(name: string): Promise<RentModel[]> {
        try {   
            return await db.rent.findAll({ where: { offinm: name, monthlyrent: 0}, order: [['trade_ymd', 'ASC']] });
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Error occurred while retrieving rent.");
        }
    }
    async findByLocationId(location_id: string): Promise<RentModel[]> {
        try {   
            return await db.rent.findAll({ where: { location_id: location_id, monthlyrent: 0}, order: [['trade_ymd', 'ASC']] });
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Error occurred while retrieving rent.");
        }
    }

}

export default new RentService();