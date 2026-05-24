const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  refreshToken,
  updateProfile,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimit.middleware');

const { registerSchema, loginSchema, updateProfileSchema } = require('../validators/auth.validator');
const validate = require('../middlewares/validate.middleware');

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh-token', authLimiter, refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.patch('/profile', protect, validate(updateProfileSchema), updateProfile);

module.exports = router;
