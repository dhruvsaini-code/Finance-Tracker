const { z } = require('zod');

const transactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['income', 'expense']),
  date: z.string().or(z.date()).optional(),
  tags: z.array(z.string()).optional().default([]),
  notes: z.string().optional().default('')
});

const validateTransaction = (req, res, next) => {
  try {
    req.body = transactionSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid transaction payload',
      errors: error.errors
    });
  }
};

module.exports = { transactionSchema, validateTransaction };
