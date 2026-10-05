const { z } = require('zod');

const budgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  limit: z.number().positive('Budget limit must be greater than 0'),
  period: z.enum(['monthly', 'weekly', 'yearly']).optional().default('monthly'),
  warningThresholdPercent: z.number().min(10).max(100).optional().default(80)
});

const validateBudget = (req, res, next) => {
  try {
    req.body = budgetSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid budget payload',
      errors: error.errors
    });
  }
};

module.exports = { budgetSchema, validateBudget };
