const transactionRepository = require('../repositories/transactionRepository');

class TransactionService {
  async createTransaction(userId, data) {
    return await transactionRepository.create({ ...data, user: userId });
  }

  async bulkCreateTransactions(userId, transactions) {
    const formatted = transactions.map((t) => ({ ...t, user: userId }));
    return await transactionRepository.insertMany(formatted);
  }

  async getTransactions(userId, query, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    return await transactionRepository.findByUser(userId, query, limit, skip);
  }

  async getTransactionById(id, userId) {
    const transaction = await transactionRepository.findById(id, userId);
    if (!transaction) throw new Error('Transaction not found');
    return transaction;
  }

  async updateTransaction(id, userId, data) {
    const transaction = await transactionRepository.update(id, userId, data);
    if (!transaction) throw new Error('Transaction not found');
    return transaction;
  }

  async deleteTransaction(id, userId) {
    const transaction = await transactionRepository.delete(id, userId);
    if (!transaction) throw new Error('Transaction not found');
    return transaction;
  }

  async getAnalytics(userId) {
    const stats = await transactionRepository.getAggregatedStats(userId);
    let totalIncome = 0;
    let totalExpense = 0;

    if (stats?.summary) {
      stats.summary.forEach((item) => {
        if (item._id === 'income') totalIncome = item.totalAmount;
        if (item._id === 'expense') totalExpense = item.totalAmount;
      });
    }

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;

    return {
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate: Number(savingsRate),
      categoryBreakdown: stats?.byCategory || [],
      monthlyTrends: stats?.monthlyTrends || [],
      weekdayDensity: stats?.weekdayDensity || []
    };
  }
}

module.exports = new TransactionService();
