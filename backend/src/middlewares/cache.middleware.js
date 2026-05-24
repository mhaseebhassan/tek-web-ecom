const { getRedisClient } = require('../config/redis');

const cache = (keyBuilder, ttlSeconds = 3600) => {
  return async (req, res, next) => {
    const client = getRedisClient();
    if (!client || !client.isOpen) {
      // Redis not available, skip cache
      return next();
    }

    const key = typeof keyBuilder === 'function' ? keyBuilder(req) : keyBuilder;

    try {
      const cachedData = await client.get(key);
      if (cachedData) {
        console.log(`Cache HIT: ${key}`);
        return res.status(200).json(JSON.parse(cachedData));
      }

      console.log(`Cache MISS: ${key}`);
      
      // Intercept res.json to cache the response
      const originalJson = res.json;
      res.json = function (body) {
        // Only cache successful GET responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          client.setEx(key, ttlSeconds, JSON.stringify(body)).catch((err) => {
            console.error('Redis setEx error:', err);
          });
        }
        originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Redis get error:', error);
      next();
    }
  };
};

const clearCache = async (keyPattern) => {
  const client = getRedisClient();
  if (!client || !client.isOpen) return;

  try {
    const keys = await client.keys(keyPattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    console.error('Redis clear cache error:', error);
  }
};

module.exports = { cache, clearCache };
