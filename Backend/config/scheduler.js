const cron = require('node-cron');
const logger = require('./logger');
const recurringService = require('../services/recurringTransactionService');

const initScheduler = () => {
  // Run every midnight to process pending recurring transactions
  cron.schedule('0 0 * * *', async () => {
    logger.info('[Scheduler] Running daily recurring transactions processor...');
    try {
      const processedCount = await recurringService.processDueTransactions();
      logger.info(`[Scheduler] Successfully processed ${processedCount} recurring transactions.`);
    } catch (error) {
      logger.error('[Scheduler] Error processing recurring transactions:', error);
    }
  });

  logger.info('[Scheduler] Background cron scheduler initialized.');
};

module.exports = { initScheduler };
