const crypto = require('crypto');
const passport = require('passport');
const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const asyncHandler = require('../middlewares/async.middleware');
const ApiError = require('../utils/ApiError');
const { generateAccessToken, generateRefreshToken, cookieOptions } = require('../utils/generateTokens');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ApiError(400, 'User already exists'));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const accessToken = generateAccessToken(user._id, user.role);
  const { refreshToken } = await generateRefreshToken(user._id, req.ip);

  res.cookie('jwt', refreshToken, cookieOptions);

  res.status(201).json({
    success: true,
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = (req, res, next) => {
  passport.authenticate('local', { session: false }, async (err, user, info) => {
    if (err) return next(err);
    if (!user) return next(new ApiError(401, info.message || 'Invalid credentials'));

    try {
      const accessToken = generateAccessToken(user._id, user.role);
      const { refreshToken } = await generateRefreshToken(user._id, req.ip);

      res.cookie('jwt', refreshToken, cookieOptions);

      res.status(200).json({
        success: true,
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

// @desc    Refresh Token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
exports.refreshToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new ApiError(401, 'No refresh token provided'));
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const storedToken = await RefreshToken.findOne({ tokenHash }).populate('user');

  if (!storedToken) {
    return next(new ApiError(401, 'Invalid refresh token'));
  }

  if (storedToken.revokedAt || storedToken.expiresAt < new Date()) {
    return next(new ApiError(401, 'Refresh token expired or revoked. Please login again.'));
  }

  // Issue new access token
  const accessToken = generateAccessToken(storedToken.user._id, storedToken.user.role);

  // Rotate refresh token (optional but good practice)
  const { refreshToken: newRefreshToken } = await generateRefreshToken(storedToken.user._id, req.ip);
  
  // Revoke old token
  storedToken.revokedAt = new Date();
  storedToken.replacedByToken = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
  await storedToken.save();

  res.cookie('jwt', newRefreshToken, cookieOptions);

  res.status(200).json({
    success: true,
    accessToken,
  });
});

// @desc    Logout user / clear cookie
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await RefreshToken.findOneAndUpdate({ tokenHash }, { revokedAt: new Date() });
  }

  res.cookie('jwt', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
});
