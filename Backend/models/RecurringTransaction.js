const mongoose = require('mongoose');

const recurringTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: true,
      default: 'monthly'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    lastTriggered: {
      type: Date
    },
    nextOccurrence: {
      type: Date,
      required: true
    },
    tags: [{ type: String, trim: true }],
    notes: { type: String, default: '' },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecurringTransaction', recurringTransactionSchema);
