const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate, registerSchema, loginSchema } = require('../validators/authValidator');
const { protect } = require('../middleware/auth');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', protect, authController.getMe);
router.put('/currency', protect, authController.updateCurrency);
router.post('/logout', authController.logout);

module.exports = router;
