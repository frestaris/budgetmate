import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: { type: String, required: true },
    email: String,
    phone: String,
    relationship: {
      type: String,
      default: "friend",
    },
    profilePicture: {
      type: String,
      default: null,
    },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
