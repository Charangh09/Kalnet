import { Router } from "express";
import { analyzeIdea } from "../controllers/analyzeController.js";

const router = Router();

router.post("/", analyzeIdea);

export default router;
