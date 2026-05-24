const jwt = require('jsonwebtoken');
const asyncHandler = require('./async.middleware');
const ApiError = require('../utils/ApiError');
const User = require('../models/user.model');
const { getJwtAccessSecret } = require('../config/env');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized to access this route'));
  }

  try {
    const decoded = jwt.verify(
      token,
      getJwtAccessSecret()
    );

    req.user = await User.findById(decoded.id);
    
    if (!req.user || !req.user.isActive) {
      return next(new ApiError(401, 'User no longer exists or is inactive'));
    }
    
    next();
  } catch (err) {
    return next(new ApiError(401, 'Not authorized to access this route'));
  }
});

exports.optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, getJwtAccessSecret());
    const user = await User.findById(decoded.id);

    if (user && user.isActive) {
      req.user = user;
    }
  } catch (err) {
    // Guest checkout should still work if an old token is present.
  }

  next();
});

// Grant access to specific roles (Middleware Factory)
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `User role ${req.user.role} is not authorized to access this route`)
      );
    }
    next();
  };
};
