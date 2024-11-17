import Budget from "../models/budget.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const addBudget = async (req, res, next) => {
  if (!req.user) {
    return next(errorHandler(403, "You are not allowed to add a budget"));
  }

  const { description, amount, category, frequency } = req.body;
  if (!description || !amount || !category || !frequency) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  const newBudget = new Budget({
    userId: req.user.id,
    description,
    amount,
    category,
    frequency,
  });

  try {
    const savedBudget = await newBudget.save();
    const user = await User.findById(req.user.id);
    if (user) {
      user.budgets.push(savedBudget._id);
      await user.save();
    }
    res.status(201).json(savedBudget);
  } catch (error) {
    console.error("Error saving budget:", error);
    next(error);
  }
};
