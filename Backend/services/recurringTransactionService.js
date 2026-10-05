const recurringRepo = require('../repositories/recurringTransactionRepository');
const transactionRepo = require('../repositories/transactionRepository');

class RecurringTransactionService {
  computeNextDate(currentDate, frequency) {
    const d = new Date(currentDate);
    switch (frequency) {
      case 'daily':
        d.setDate(d.getDate() + 1);
        break;
      case 'weekly':
        d.setDate(d.getDate() + 7);
        break;
      case 'monthly':
        d.setMonth(d.getMonth() + 1);
        break;
      case 'yearly':
        d.setFullYear(d.getFullYear() + 1);
        break;
      default:
        d.setMonth(d.getMonth() + 1);
    }
    return d;
  }

  async create(userId, data) {
    const nextOccurrence = data.startDate ? new Date(data.startDate) : new Date();
    return await recurringRepo.create({
      ...data,
      user: userId,
      nextOccurrence
    });
  }

  async getByUser(userId) {
    return await recurringRepo.findByUser(userId);
  }

  async update(id, userId, data) {
    return await recurringRepo.update(id, userId, data);
  }

  async delete(id, userId) {
    return await recurringRepo.delete(id, userId);
  }

  async processDueTransactions() {
    const dueList = await recurringRepo.findDueTransactions();
    let processed = 0;

    for (const item of dueList) {
      // Create ledger transaction
      await transactionRepo.create({
        user: item.user,
        amount: item.amount,
        category: item.category,
        description: `[Recurring] ${item.description}`,
        type: item.type,
        date: new Date(),
        tags: [...(item.tags || []), 'recurring'],
        notes: item.notes
      });

      // Update next occurrence
      const nextDate = this.computeNextDate(item.nextOccurrence, item.frequency);
      await recurringRepo.update(item._id, item.user, {
        lastTriggered: new Date(),
        nextOccurrence: nextDate
      });
      processed++;
    }

    return processed;
  }
}

module.exports = new RecurringTransactionService();
