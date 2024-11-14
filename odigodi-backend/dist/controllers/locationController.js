"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const locationService_1 = __importDefault(require("../services/locationService"));
const uuid_1 = require("uuid");
class LocationController {
    // Create location
    async create(req, res) {
        try {
            // Validate request
            if (!req.body.offinm) {
                res.status(400).send({
                    success: false,
                    message: "Office name cannot be empty!"
                });
                return;
            }
            const locationData = {
                offinm: req.body.offinm,
                lat: Number(req.body.lat),
                lng: Number(req.body.lng)
            };
            const data = await locationService_1.default.create(locationData);
            res.status(201).send({
                success: true,
                data
            });
        }
        catch (error) {
            res.status(500).send({
                success: false,
                message: error instanceof Error ? error.message : "Some error occurred while creating the Location."
            });
        }
    }
    // Find all locations
    async findAll(req, res) {
        try {
            const data = await locationService_1.default.findAll();
            res.send({
                success: true,
                data
            });
        }
        catch (error) {
            res.status(500).send({
                success: false,
                message: error instanceof Error ? error.message : "Some error occurred while retrieving locations."
            });
        }
    }
    // Find one location
    async findOne(req, res) {
        const { id } = req.params;
        // Validate UUID
        if (!(0, uuid_1.validate)(id)) {
            res.status(400).send({
                success: false,
                message: "Invalid ID format"
            });
            return;
        }
        try {
            const data = await locationService_1.default.findOne(id);
            if (data) {
                res.send({
                    success: true,
                    data
                });
            }
            else {
                res.status(404).send({
                    success: false,
                    message: `Location with id=${id} was not found`
                });
            }
        }
        catch (error) {
            res.status(500).send({
                success: false,
                message: error instanceof Error ? error.message : "Error retrieving Location"
            });
        }
    }
}
exports.default = new LocationController();
