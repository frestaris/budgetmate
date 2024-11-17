import express from "express";
import {
  addBudget,
  getBudgets,
  deleteBudget,
} from "../controllers/budget.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/addbudget", verifyToken, addBudget);
router.get("/getbudgets", verifyToken, getBudgets);
router.delete("/deletebudget/:budgetId", verifyToken, deleteBudget);

export default router;
