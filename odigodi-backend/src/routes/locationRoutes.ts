import { Router } from 'express';
import locationController from '../controllers/locationController';

const router = Router();

// Retrieve all Locations
router.get('/get/all', locationController.findAll);

// Retrieve a single Location with id
router.get('/get/:id', locationController.findOne);


export default router;