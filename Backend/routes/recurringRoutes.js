const express = require('express');
const router = express.Router();
const recurringController = require('../controllers/recurringTransactionController');
const { protect } = require('../middleware/auth');
const { validateRecurring } = require('../validators/recurringTransactionValidator');

router.use(protect);

router
  .route('/')
  .get(recurringController.getRecurring)
  .post(validateRecurring, recurringController.createRecurring);

router
  .route('/:id')
  .put(recurringController.updateRecurring)
  .delete(recurringController.deleteRecurring);

module.exports = router;
