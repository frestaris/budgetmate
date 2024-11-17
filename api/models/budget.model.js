import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    frequency: { type: String, required: true },
  },
  { timestamps: true }
);

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
