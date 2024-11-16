import { errorHandler } from "../utils/error.js";
import Contact from "../models/contact.model.js";

import User from "../models/user.model.js";

export const add = async (req, res, next) => {
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
    const user = await User.findById(req.user.id);
    if (user) {
      user.contacts.push({
        contact_id: savedContact._id,
        relationship: req.body.relationship || "friend",
      });
      await user.save();
    }
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
  const { contactId } = req.params;
  const updatedData = req.body;

  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return next(errorHandler(404, "Contact not found"));
    }

    if (contact.userId.toString() !== req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to update this contact")
      );
    }

    const updateFields = {};

    if (updatedData.name) updateFields.name = updatedData.name;
    if (updatedData.email) updateFields.email = updatedData.email;
    if (updatedData.profilePicture)
      updateFields.profilePicture = updatedData.profilePicture;
    if (updatedData.phone) updateFields.phone = updatedData.phone;
    if (updatedData.relationship)
      updateFields.relationship = updatedData.relationship;

    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { $set: updateFields },
      { new: true }
    );

    const { phone, ...rest } = updatedContact._doc;
    res
      .status(200)
      .json({ message: "Contact updated successfully", contact: rest });
  } catch (error) {
    console.error("Error updating contact:", error);
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await Contact.findById(contactId);
    if (!contact) {
      console.log("Contact not found");
      return res.status(404).json({ message: "Contact not found" });
    }
    if (contact.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    await contact.deleteOne();
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error in deletecontact:", error.message, error.stack);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
