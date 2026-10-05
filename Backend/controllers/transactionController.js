const transactionService = require('../services/transactionService');
const auditService = require('../services/auditService');
const aiService = require('../ai/aiService');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');

exports.createTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction(req.user._id, req.body);
    await auditService.log({
      userId: req.user._id,
      action: 'TRANSACTION_CREATE',
      entityType: 'Transaction',
      entityId: transaction._id.toString(),
      details: { amount: transaction.amount, category: transaction.category },
      req
    });
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

exports.bulkCreateTransactions = async (req, res, next) => {
  try {
    const transactions = await transactionService.bulkCreateTransactions(req.user._id, req.body.transactions);
    res.status(201).json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    next(error);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const result = await transactionService.getTransactions(req.user._id, req.query, page, limit);
    res.status(200).json({
      success: true,
      data: result.transactions,
      pagination: {
        total: result.total,
        page,
        pages: Math.ceil(result.total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.updateTransaction(req.params.id, req.user._id, req.body);
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    await transactionService.deleteTransaction(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const analytics = await transactionService.getAnalytics(req.user._id);
    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
};

exports.getAIInsights = async (req, res, next) => {
  try {
    const { transactions } = await transactionService.getTransactions(req.user._id, {}, 500, 0);
    const budgets = await Budget.find({ user: req.user._id });
    const savingsGoals = await SavingsGoal.find({ user: req.user._id });

    const insights = await aiService.generateInsights(transactions, budgets, savingsGoals);
    res.status(200).json({ success: true, data: insights });
  } catch (error) {
    next(error);
  }
};
