import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { add, getContacts } from "../controllers/contacts.controller.js";

const router = express.Router();

router.post("/addcontact", verifyToken, add);
router.get("/getcontacts", getContacts);

export default router;
