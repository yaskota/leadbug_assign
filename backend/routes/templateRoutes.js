// routes/templateRoutes.js
import express from "express";
import { createTemplate, getTemplates, getTemplateById } from "../controllers/templateController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);

router.post("/create", createTemplate);
router.get("/", getTemplates);
router.get("/:id", getTemplateById);

export default router;