const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 1
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    targetDate: {
      type: Date,
      required: true
    },
    category: {
      type: String,
      default: 'General'
    },
    color: {
      type: String,
      default: '#10B981'
    },
    icon: {
      type: String,
      default: 'Target'
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);
