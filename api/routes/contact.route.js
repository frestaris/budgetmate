import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  add,
  getContacts,
  updateContact,
  deleteContact,
} from "../controllers/contacts.controller.js";

const router = express.Router();

router.post("/addcontact", verifyToken, add);
router.get("/getcontacts", getContacts);
router.put("/updatecontact/:contactId", verifyToken, updateContact);
router.delete("/deletecontact/:contactId", verifyToken, deleteContact);
export default router;
