const recurringService = require('../services/recurringTransactionService');

exports.getRecurring = async (req, res, next) => {
  try {
    const list = await recurringService.getByUser(req.user._id);
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

exports.createRecurring = async (req, res, next) => {
  try {
    const item = await recurringService.create(req.user._id, req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

exports.updateRecurring = async (req, res, next) => {
  try {
    const item = await recurringService.update(req.params.id, req.user._id, req.body);
    if (!item) return res.status(404).json({ success: false, message: 'Recurring transaction not found' });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

exports.deleteRecurring = async (req, res, next) => {
  try {
    const item = await recurringService.delete(req.params.id, req.user._id);
    if (!item) return res.status(404).json({ success: false, message: 'Recurring transaction not found' });
    res.status(200).json({ success: true, message: 'Recurring transaction deleted' });
  } catch (error) {
    next(error);
  }
};
