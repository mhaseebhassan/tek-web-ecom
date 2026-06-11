const { createClient } = require('redis');

let redisClient;
let redisUnavailableLogged = false;
let redisConnecting;

const connectRedis = async () => {
  if (process.env.REDIS_ENABLED === 'false') {
    console.log('Redis disabled via REDIS_ENABLED=false');
    return null;
  }

  if (redisClient?.isOpen) return redisClient;
  if (redisConnecting) return redisConnecting;

  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
      reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
    },
  });

  redisClient.on('error', (error) => {
    if (!redisUnavailableLogged) {
      redisUnavailableLogged = true;
      console.warn(
        `Redis unavailable - caching disabled until Redis reconnects (${error.message}). ` +
          'Start Redis or set REDIS_ENABLED=false in .env to hide this message.'
      );
    }
  });

  redisClient.on('ready', () => {
    redisUnavailableLogged = false;
    console.log('Redis connected successfully');
  });

  redisConnecting = redisClient
    .connect()
    .catch(() => {
      redisClient = null;
    })
    .finally(() => {
      redisConnecting = null;
    });

  await redisConnecting;
  return redisClient;
};

const getRedisClient = () => redisClient;

module.exports = { connectRedis, getRedisClient };
