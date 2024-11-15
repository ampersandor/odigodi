import { Router } from "express";
import rentController from "../controllers/rentController";

const router = Router();

router.get("/:location_id", rentController.findByLocationId);

export default router;  