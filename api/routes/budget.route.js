import express from "express";
import { addBudget } from "../controllers/budget.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/addbudget", verifyToken, addBudget);

export default router;
