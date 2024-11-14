import { Router } from "express";
import tradeController from "../controllers/tradeController";

const router = Router();

router.get("/:name", tradeController.findByName);

export default router;  