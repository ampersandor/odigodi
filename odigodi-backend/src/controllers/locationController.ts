import { Request, Response } from "express";
import { validate as uuidValidate } from 'uuid';

import locationService from "../services/locationService";
import { Bounds } from "../types/map.types";
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

  async findInBounds(req: Request, res: Response): Promise<void> {
    try {
      const { northEast, southWest } = req.query;
      // Validate query parameters
      if (!northEast || !southWest) {
        res.status(400).send({
          success: false,
          message: "Missing bounds parameters"
        });
        return;
      }
      // Parse and validate coordinates
      try {
        const bounds: Bounds = {
          northEast: JSON.parse(northEast as string),
          southWest: JSON.parse(southWest as string)
        };
        // Validate coordinate values
        if (!this.isValidCoordinates(bounds.northEast) || 
            !this.isValidCoordinates(bounds.southWest)) {
          res.status(400).send({
            success: false,
            message: "Invalid coordinates format"
          });
          return;
        }

        const data = await locationService.findInBounds(bounds);
        res.send({
          success: true,
          data
        });
      } catch (error) {
        res.status(400).send({
          success: false,
          message: error instanceof Error ? error.message : "Invalid bounds format"
        });
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error instanceof Error 
          ? error.message 
          : "Some error occurred while retrieving locations within bounds."
      });
    }
  }

  /**
   * Validate coordinate values
   */
  private isValidCoordinates(coord: { lat: number; lng: number }): boolean {
    return (
      typeof coord.lat === 'number' &&
      typeof coord.lng === 'number' &&
      coord.lat >= -90 && 
      coord.lat <= 90 &&
      coord.lng >= -180 && 
      coord.lng <= 180
    );
  }
}

export default new LocationController();