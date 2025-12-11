import express from "express";
import { getWaterRecommendation } from "../controllers/waterController.js";

const router = express.Router();

router.get("/users/:id/water-recommendation", getWaterRecommendation);

export default router;
