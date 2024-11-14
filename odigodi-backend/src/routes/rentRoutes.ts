import { Router } from "express";
import rentController from "../controllers/rentController";

const router = Router();

router.get("/:name", rentController.findByName);

export default router;  