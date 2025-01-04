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

export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    res.status(200).json({ budgets });
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ message: "Error fetching budgets" });
  }
};

export const deleteBudget = async (req, res, next) => {
  if (!req.user) {
    return next(
      errorHandler(403, "You are not authorized to delete this budget")
    );
  }
  const { budgetId } = req.params;
  try {
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return next(errorHandler(404, "Budget not found"));
    }
    if (budget.userId.toString() !== req.user.id) {
      return next(
        errorHandler(403, "You are not authorized to delete this budget")
      );
    }
    await Budget.findByIdAndDelete(req.params.budgetId);

    const user = await User.findById(req.user.id);
    if (user) {
      user.budgets = user.budgets.filter((id) => id.toString() !== budgetId);
      await user.save();
    }
    const updatedBudgets = await Budget.find({ userId: req.user.id });
    res.status(200).json({
      message: "Budget deleted successfully",
      budgets: updatedBudgets,
    });
  } catch (error) {
    console.error("Error deleting budget:", error);
    next(error);
  }
};
