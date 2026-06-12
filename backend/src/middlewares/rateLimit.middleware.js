const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { getRedisClient, connectRedis } = require('../config/redis');

const sendCommand = async (...args) => {
  let client = getRedisClient();
  if (!client || !client.isOpen) {
    client = await connectRedis(); // Wait for it to connect on boot
  }
  if (client && client.isOpen) {
    return client.sendCommand(args);
  }
  // Graceful fallback if Redis drops; express-rate-limit handles errors
  throw new Error('Redis not connected');
};

const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand,
    prefix: 'rl:global:',
  }),
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});

const authLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand,
    prefix: 'rl:auth:',
  }),
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
});

module.exports = { globalLimiter, authLimiter };
