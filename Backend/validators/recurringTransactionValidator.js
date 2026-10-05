const { z } = require('zod');

const recurringSchema = z.object({
  amount: z.number().positive(),
  category: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['income', 'expense']),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  startDate: z.string().or(z.date()).optional(),
  tags: z.array(z.string()).optional().default([]),
  notes: z.string().optional().default(''),
  isActive: z.boolean().optional().default(true)
});

const validateRecurring = (req, res, next) => {
  try {
    req.body = recurringSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid recurring transaction payload',
      errors: error.errors
    });
  }
};

module.exports = { recurringSchema, validateRecurring };
