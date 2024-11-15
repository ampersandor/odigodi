import { Router } from "express";
import tradeController from "../controllers/tradeController";

const router = Router();

router.get("/:location_id", tradeController.findByLocationId);

export default router;  