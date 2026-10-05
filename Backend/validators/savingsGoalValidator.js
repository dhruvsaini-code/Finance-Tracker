const { z } = require('zod');

const savingsGoalSchema = z.object({
  name: z.string().min(1, 'Goal name is required'),
  targetAmount: z.number().positive('Target amount must be greater than 0'),
  currentAmount: z.number().min(0).optional().default(0),
  targetDate: z.string().or(z.date()),
  category: z.string().optional().default('General'),
  color: z.string().optional().default('#10B981'),
  icon: z.string().optional().default('Target')
});

const validateSavingsGoal = (req, res, next) => {
  try {
    req.body = savingsGoalSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid savings goal payload',
      errors: error.errors
    });
  }
};

module.exports = { savingsGoalSchema, validateSavingsGoal };
