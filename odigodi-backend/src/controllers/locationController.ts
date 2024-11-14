import { Request, Response } from "express";
import locationService from "../services/locationService";
import { validate as uuidValidate } from 'uuid';

class LocationController {
  // Find all locations
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const data = await locationService.findAll();
      res.send({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error instanceof Error ? error.message : "Some error occurred while retrieving locations."
      });
    }
  }

  // Find one location
  async findOne(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    // Validate UUID
    if (!uuidValidate(id)) {
      res.status(400).send({
        success: false,
        message: "Invalid ID format"
      });
      return;
    }

    try {
      const data = await locationService.findOne(id);
      if (data) {
        res.send({
          success: true,
          data
        });
      } else {
        res.status(404).send({
          success: false,
          message: `Location with id=${id} was not found`
        });
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error instanceof Error ? error.message : "Error retrieving Location"
      });
    }
  }
}

export default new LocationController();