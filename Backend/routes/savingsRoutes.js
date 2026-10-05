const express = require('express');
const router = express.Router();
const savingsController = require('../controllers/savingsController');
const { protect } = require('../middleware/auth');
const { validateSavingsGoal } = require('../validators/savingsGoalValidator');

router.use(protect);

router
  .route('/')
  .get(savingsController.getGoals)
  .post(validateSavingsGoal, savingsController.createGoal);

router.post('/:id/contribute', savingsController.contributeToGoal);

router
  .route('/:id')
  .put(savingsController.updateGoal)
  .delete(savingsController.deleteGoal);

module.exports = router;
