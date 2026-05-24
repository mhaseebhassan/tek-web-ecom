const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  refreshToken,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const { registerSchema, loginSchema } = require('../validators/auth.validator');
const validate = require('../middlewares/validate.middleware');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
