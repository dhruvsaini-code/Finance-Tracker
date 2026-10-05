const RecurringTransaction = require('../models/RecurringTransaction');

class RecurringTransactionRepository {
  async create(data) {
    return await RecurringTransaction.create(data);
  }

  async findByUser(userId) {
    return await RecurringTransaction.find({ user: userId }).sort({ nextOccurrence: 1 });
  }

  async findDueTransactions() {
    return await RecurringTransaction.find({
      isActive: true,
      nextOccurrence: { $lte: new Date() }
    });
  }

  async update(id, userId, data) {
    return await RecurringTransaction.findOneAndUpdate(
      { _id: id, user: userId },
      data,
      { new: true, runValidators: true }
    );
  }

  async delete(id, userId) {
    return await RecurringTransaction.findOneAndDelete({ _id: id, user: userId });
  }
}

module.exports = new RecurringTransactionRepository();
