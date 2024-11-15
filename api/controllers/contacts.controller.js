import { errorHandler } from "../utils/error.js";
import Contact from "../models/contact.model.js";

export const add = async (req, res, next) => {
  console.log(req.body);
  if (!req.user) {
    return next(errorHandler(403, "You are not allowed to add a contact"));
  }
  if (!req.body.name || !req.body.phone) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  const slug = req.body.name
    .toLowerCase()
    .split(" ")
    .join("-")
    .replace(/[^a-z0-9-]/g, "");
  const newContact = new Contact({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    console.error("Error saving contact:", error);
    next(error);
  }
};
