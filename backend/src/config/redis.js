const { createClient } = require('redis');

let redisClient;
let redisUnavailableLogged = false;

const connectRedis = async () => {
  if (process.env.REDIS_ENABLED === 'false') {
    console.log('Redis disabled via REDIS_ENABLED=false');
    return;
  }

  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: { reconnectStrategy: false },
  });

  redisClient.on('error', () => {
    // Avoid spamming the console when Redis is not running
  });

  try {
    await redisClient.connect();
    console.log('Redis connected successfully');
  } catch (error) {
    redisClient = null;
    if (!redisUnavailableLogged) {
      redisUnavailableLogged = true;
      console.warn(
        'Redis unavailable — caching disabled. Start Redis or set REDIS_ENABLED=false in .env to hide this message.'
      );
    }
  }
};

const getRedisClient = () => redisClient;

module.exports = { connectRedis, getRedisClient };
