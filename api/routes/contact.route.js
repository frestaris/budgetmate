import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { add } from "../controllers/contacts.controller.js";

const router = express.Router();

router.post("/add-contact", verifyToken, add);

export default router;
