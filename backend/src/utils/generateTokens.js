const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/refreshToken.model');
const { getJwtAccessSecret } = require('../config/env');

const parseRefreshExpiry = (value) => {
  const match = /^(\d+)([dhms])$/i.exec(String(value).trim());
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = { d: 86400000, h: 3600000, m: 60000, s: 1000 };
  return amount * (multipliers[unit] || multipliers.d);
};

const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    getJwtAccessSecret(),
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
};

const generateRefreshToken = async (userId, ipAddress) => {
  const refreshToken = crypto.randomBytes(40).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const jti = crypto.randomUUID();

  const refreshMs = parseRefreshExpiry(process.env.JWT_REFRESH_EXPIRES_IN || '7d');
  const expiresAt = new Date(Date.now() + refreshMs);

  await RefreshToken.create({
    user: userId,
    tokenHash,
    jti,
    expiresAt,
    createdByIp: ipAddress,
  });

  return { refreshToken, jti };
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === 'true',
  sameSite: process.env.COOKIE_SAME_SITE || 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  cookieOptions,
};
