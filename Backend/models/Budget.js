const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    limit: {
      type: Number,
      required: true,
      min: 1
    },
    period: {
      type: String,
      enum: ['monthly', 'weekly', 'yearly'],
      default: 'monthly'
    },
    warningThresholdPercent: {
      type: Number,
      default: 80,
      min: 10,
      max: 100
    }
  },
  { timestamps: true }
);

budgetSchema.index({ user: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
