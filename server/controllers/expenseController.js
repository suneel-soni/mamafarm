const Expense = require('../models/Expense');
const ActivityLog = require('../models/ActivityLog');

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ expenseDate: -1 });

    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    const categoryBreakdown = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    res.json({
      success: true,
      data: expenses,
      meta: {
        totalExpense,
        categoryBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const { title, category, amount, expenseDate, paymentMethod, notes } = req.body;

    const expense = await Expense.create({
      title,
      category,
      amount: Number(amount),
      expenseDate: expenseDate || new Date(),
      paymentMethod,
      notes,
    });

    await ActivityLog.create({
      action: 'Expense Added',
      description: `Recorded ₹${amount} for ${title} [${category}]`,
      entityType: 'Expense',
      entityId: expense._id,
    });

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
