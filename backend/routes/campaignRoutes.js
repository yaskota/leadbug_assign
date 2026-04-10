// routes/campaignRoutes.js
import express from "express";
import { sendCampaign, getCampaignStatus } from "../controllers/campaignController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();
router.use(protectRoute);

router.post("/send", sendCampaign);
router.get("/status", getCampaignStatus);

export default router;
