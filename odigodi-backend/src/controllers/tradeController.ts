import { Request, Response } from "express";
import tradeService from "../services/tradeService";

class TradeController {
    async findByName(req: Request, res: Response): Promise<void> {
        const { name } = req.params;
        try {
            const data = await tradeService.findByName(name);
            if (data) {
                res.send({
                    success: true,
                    data
                });
            } else {
                res.status(404).send({
                    success: false,
                    message: `Trade with name=${name} was not found`
                });
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                message: error instanceof Error ? error.message : "Error occurred while retrieving trade."
            });
        }
    } 
}

export default new TradeController();