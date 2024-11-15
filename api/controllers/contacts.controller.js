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

export const getContacts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const query = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.friendship && { friendship: req.query.friendship }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.contactId && { _id: req.query.contactId }),
      ...(req.query.searchTerm && {
        $or: [
          { name: { $regex: req.query.searchTerm, $options: "i" } },
          { email: { $regex: req.query.searchTerm, $options: "i" } },
          { phone: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };

    const contacts = await Contact.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex);

    res.status(200).json({
      contacts,
    });
  } catch (error) {
    console.error("Error getting contacts:", error);
    next(error);
  }
};