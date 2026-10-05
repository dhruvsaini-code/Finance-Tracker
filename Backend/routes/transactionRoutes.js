const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');
const { validateTransaction } = require('../validators/transactionValidator');

router.use(protect);

router.get('/analytics', transactionController.getAnalytics);
router.get('/insights', transactionController.getAIInsights);
router.post('/bulk', transactionController.bulkCreateTransactions);

router
  .route('/')
  .get(transactionController.getTransactions)
  .post(validateTransaction, transactionController.createTransaction);

router
  .route('/:id')
  .get(transactionController.getTransaction)
  .put(transactionController.updateTransaction)
  .delete(transactionController.deleteTransaction);

module.exports = router;
