const Expense = require('../models/Expense');

const getRequestUserId = (req) => {
  return req?.user?.id || req?.user?.userId || req?.user?._id || null;
};

// Add a new expense
const addExpense = async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;
    const userId = getRequestUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized, user id missing' });
    }

    const newExpense = new Expense({
      userId,
      amount,
      category,
      date,
      note,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense', error: error.message });
  }
};

// Get all expenses for the logged-in user
const getExpenses = async (req, res) => {
  try {
    const userId = getRequestUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized, user id missing' });
    }

    // Sort by date (latest first)
    const expenses = await Expense.find({ userId }).sort({ date: -1, createdAt: -1 }).lean();
    console.log('GET /api/expenses userId:', userId, 'count:', expenses.length);
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
};

// Delete an expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getRequestUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized, user id missing' });
    }

    // Ensure the expense belongs to the logged-in user
    const expense = await Expense.findOneAndDelete({ _id: id, userId });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error: error.message });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense,
};
