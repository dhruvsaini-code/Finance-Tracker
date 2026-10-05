const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

class TransactionRepository {
  async create(transactionData) {
    return await Transaction.create(transactionData);
  }

  async insertMany(transactions) {
    return await Transaction.insertMany(transactions);
  }

  async findByUser(userId, query = {}, limit = 100, skip = 0) {
    const filter = { user: new mongoose.Types.ObjectId(userId) };

    if (query.type) filter.type = query.type;
    if (query.category) filter.category = query.category;
    if (query.search) {
      filter.$or = [
        { description: { $regex: query.search, $options: 'i' } },
        { notes: { $regex: query.search, $options: 'i' } },
        { category: { $regex: query.search, $options: 'i' } }
      ];
    }
    if (query.startDate || query.endDate) {
      filter.date = {};
      if (query.startDate) filter.date.$gte = new Date(query.startDate);
      if (query.endDate) filter.date.$lte = new Date(query.endDate);
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
      Transaction.countDocuments(filter)
    ]);

    return { transactions, total };
  }

  async findById(id, userId) {
    return await Transaction.findOne({ _id: id, user: userId });
  }

  async update(id, userId, updateData) {
    return await Transaction.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      { new: true, runValidators: true }
    );
  }

  async delete(id, userId) {
    return await Transaction.findOneAndDelete({ _id: id, user: userId });
  }

  async getAggregatedStats(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const result = await Transaction.aggregate([
      { $match: { user: userObjectId } },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: '$type',
                totalAmount: { $sum: '$amount' },
                count: { $sum: 1 }
              }
            }
          ],
          byCategory: [
            { $match: { type: 'expense' } },
            {
              $group: {
                _id: '$category',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
              }
            },
            { $sort: { total: -1 } }
          ],
          monthlyTrends: [
            {
              $group: {
                _id: {
                  year: { $year: '$date' },
                  month: { $month: '$date' },
                  type: '$type'
                },
                total: { $sum: '$amount' }
              }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
          ],
          weekdayDensity: [
            { $match: { type: 'expense' } },
            {
              $group: {
                _id: { $dayOfWeek: '$date' },
                total: { $sum: '$amount' },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id': 1 } }
          ]
        }
      }
    ]);

    return result[0];
  }
}

module.exports = new TransactionRepository();
