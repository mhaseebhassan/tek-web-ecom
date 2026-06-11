const crypto = require('crypto');
const passport = require('passport');
const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const asyncHandler = require('../middlewares/async.middleware');
const ApiError = require('../utils/ApiError');
const { generateAccessToken, generateRefreshToken, cookieOptions } = require('../utils/generateTokens');

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
});

const sendAuthResponse = (res, statusCode, message, user, accessToken) => {
  res.status(statusCode).json({
    success: true,
    message,
    data: {
      user: formatUser(user),
      accessToken,
    },
  });
};

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ApiError(400, 'User already exists'));
  }

  const user = await User.create({ name, email, password });
  const accessToken = generateAccessToken(user._id, user.role);
  const { refreshToken } = await generateRefreshToken(user._id, req.ip);

  res.cookie('jwt', refreshToken, cookieOptions);
  sendAuthResponse(res, 201, 'Registration successful', user, accessToken);
});

exports.login = (req, res, next) => {
  passport.authenticate('local', { session: false }, async (err, user, info) => {
    if (err) return next(err);
    if (!user) return next(new ApiError(401, info?.message || 'Invalid credentials'));

    try {
      const accessToken = generateAccessToken(user._id, user.role);
      const { refreshToken } = await generateRefreshToken(user._id, req.ip);

      res.cookie('jwt', refreshToken, cookieOptions);
      sendAuthResponse(res, 200, 'Login successful', user, accessToken);
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

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

  if (!storedToken.user || !storedToken.user.isActive) {
    return next(new ApiError(401, 'User no longer exists or is inactive'));
  }

  const accessToken = generateAccessToken(storedToken.user._id, storedToken.user.role);
  const { refreshToken: newRefreshToken } = await generateRefreshToken(storedToken.user._id, req.ip);

  storedToken.revokedAt = new Date();
  storedToken.replacedByToken = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
  await storedToken.save();

  res.cookie('jwt', newRefreshToken, cookieOptions);

  res.status(200).json({
    success: true,
    message: 'Token refreshed',
    data: { accessToken },
  });
});

exports.logout = asyncHandler(async (req, res) => {
  const token = req.cookies.jwt;

  if (token) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await RefreshToken.findOneAndUpdate({ tokenHash }, { revokedAt: new Date() });
  }

  res.cookie('jwt', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      user: formatUser(user),
    },
  });
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { name, phone, address, avatar } = req.body;
  const updates = {};

  if (name !== undefined) updates.name = name;
  if (phone !== undefined) updates.phone = phone;
  if (address !== undefined) updates.address = address;
  if (avatar !== undefined) updates.avatar = avatar;

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated',
    data: { user: formatUser(user) },
  });
});
