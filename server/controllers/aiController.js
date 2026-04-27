const aiService = require('../services/aiService');
const Expense = require('../models/Expense');

const categoryMap = {
  food: ['food'],
  travel: ['travel', 'transport', 'auto', 'metro', 'bus'],
  shopping: ['shopping'],
};

function toDateOnly(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

const processQuery = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    let filters;
    try {
      filters = await aiService.parseNaturalLanguageQuery(query);
      console.log('AI Filters:', filters);
    } catch (error) {
      return res.status(500).json({ message: 'Error parsing query filters', error: error.message });
    }

    const expenses = await Expense.find({ userId: req.user.id });
    console.log('All Expenses:', expenses);
    const aiCategory = filters?.category ? String(filters.category).toLowerCase() : null;
    const keyword = filters?.keyword ? String(filters.keyword).toLowerCase().trim() : null;
    const timeRange = filters?.timeRange ? String(filters.timeRange).toLowerCase() : null;

    const categoryAliases = aiCategory && categoryMap[aiCategory] ? categoryMap[aiCategory] : [];

    const filteredExpenses = expenses.filter((expense) => {
      const expenseCategory = String(expense.category || '').toLowerCase();
      const note = String(expense.note || '').toLowerCase();

      let categoryMatch = true;
      if (aiCategory) {
        if (categoryAliases.length > 0) {
          categoryMatch = categoryAliases.some(
            (alias) => expenseCategory.includes(alias) || note.includes(alias)
          );
        } else {
          categoryMatch = expenseCategory.includes(aiCategory) || note.includes(aiCategory);
        }
      }

      let keywordMatch = true;
      if (keyword) {
        keywordMatch = note.includes(keyword) || expenseCategory.includes(keyword);
      }

      const expenseDate = toDateOnly(expense.date);
      const today = toDateOnly(new Date());
      const matchesDate = timeRange == 'today' ? expenseDate == today : true;

      return categoryMatch && keywordMatch && matchesDate;
    });

    console.log('Filtered Expenses:', filteredExpenses);

    const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      total,
      message: `You spent ₹${total}`,
    });
  } catch (error) {
    console.error('AI Query Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  processQuery,
};
