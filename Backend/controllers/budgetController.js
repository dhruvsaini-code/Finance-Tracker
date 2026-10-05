const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

exports.getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    
    // Calculate current month's spending for each category
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const spendings = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          spent: { $sum: '$amount' }
        }
      }
    ]);

    const spendingMap = {};
    spendings.forEach((s) => {
      spendingMap[s._id] = s.spent;
    });

    const budgetsWithSpent = budgets.map((b) => {
      const spent = spendingMap[b.category] || 0;
      const percentage = b.limit > 0 ? (spent / b.limit) * 100 : 0;
      return {
        ...b.toObject(),
        spent,
        remaining: Math.max(0, b.limit - spent),
        percentage: Number(percentage.toFixed(1)),
        isExceeded: spent > b.limit
      };
    });

    res.status(200).json({ success: true, data: budgetsWithSpent });
  } catch (error) {
    next(error);
  }
};

exports.createOrUpdateBudget = async (req, res, next) => {
  try {
    const { category, limit, period, warningThresholdPercent } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category },
      { limit, period, warningThresholdPercent },
      { upsert: true, new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    next(error);
  }
};

exports.deleteBudget = async (req, res, next) => {
  try {
    await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.status(200).json({ success: true, message: 'Budget deleted successfully' });
  } catch (error) {
    next(error);
  }
};
