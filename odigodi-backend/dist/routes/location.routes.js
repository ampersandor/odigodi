"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const locationController_1 = __importDefault(require("../controllers/locationController"));
const router = (0, express_1.Router)();
// Retrieve all Locations
router.get('/', locationController_1.default.findAll);
// Create a new Location
router.post('/', locationController_1.default.create);
// Retrieve a single Location with id
router.get('/:id', locationController_1.default.findOne);
exports.default = router;
