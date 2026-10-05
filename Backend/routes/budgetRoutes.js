const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');
const { validateBudget } = require('../validators/budgetValidator');

router.use(protect);

router
  .route('/')
  .get(budgetController.getBudgets)
  .post(validateBudget, budgetController.createOrUpdateBudget);

router.route('/:id').delete(budgetController.deleteBudget);

module.exports = router;
