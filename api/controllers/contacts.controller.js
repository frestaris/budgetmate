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

    const contacts = await Contact.find(query).sort({ name: 1 });

    res.status(200).json({
      contacts,
    });
  } catch (error) {
    console.error("Error getting contacts:", error);
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { contactId } = req.params; // Get the contactId from the URL
  const updatedData = req.body; // Get the data to update from the request body

  try {
    // Find the contact by its ID
    const contact = await Contact.findById(contactId);

    if (!contact) {
      return next(errorHandler(404, "Contact not found"));
    }

    // Ensure the current user is the owner of the contact
    if (contact.userId.toString() !== req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to update this contact")
      );
    }

    // Update the contact with the new data
    Object.assign(contact, updatedData); // Merge updated data into the existing contact

    const updatedContact = await contact.save(); // Save the updated contact

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    next(error);
  }
};
