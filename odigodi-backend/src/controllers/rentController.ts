import { Request, Response } from "express";
import rentService from "../services/rentService";

class RentController {
    async findByName(req: Request, res: Response): Promise<void> {
        const { name } = req.params;
        console.log(name);
        try {
            const data = await rentService.findByName(name);
            if (data) {
                res.send({
                    success: true,
                    data
                });
            } else {
                res.status(404).send({
                    success: false,
                    message: `Rent with name=${name} was not found`
                });
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                message: error instanceof Error ? error.message : "Error occurred while retrieving rent."
            });
        }
    }

    async findByLocationId(req: Request, res: Response): Promise<void> {
        const { location_id } = req.params;
        try {
            const data = await rentService.findByLocationId(location_id);
            if (data) {
                res.send({
                    success: true,
                    data
                });
            } else {
                res.status(404).send({
                    success: false,
                    message: `Rent with location_id=${location_id} was not found`
                });
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                message: error instanceof Error ? error.message : "Error occurred while retrieving rent."
            });
        }
    }
}

export default new RentController();
