import { getRedisClient, isRedisConnected } from '../config/redis.js';

// Cache middleware for GET requests
export const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET' || !isRedisConnected()) {
      return next();
    }

    const redisClient = getRedisClient();
    const key = `cache:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        console.log(`Cache HIT: ${key}`);
        return res.json(JSON.parse(cachedData));
      }

      console.log(`Cache MISS: ${key}`);

      // Modify res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = (data) => {
        // Cache the response
        redisClient.setEx(key, duration, JSON.stringify(data))
          .catch(err => console.error('Cache set error:', err));

        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Clear cache by pattern
export const clearCache = async (pattern = '*') => {
  if (!isRedisConnected()) return;

  const redisClient = getRedisClient();
  try {
    const keys = await redisClient.keys(`cache:${pattern}`);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`Cleared ${keys.length} cache keys`);
    }
  } catch (error) {
    console.error('Clear cache error:', error);
  }
};

// Cache specific data with custom key
export const cacheData = async (key, data, duration = 300) => {
  if (!isRedisConnected()) return false;

  const redisClient = getRedisClient();
  try {
    await redisClient.setEx(`cache:${key}`, duration, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Cache data error:', error);
    return false;
  }
};

// Get cached data
export const getCachedData = async (key) => {
  if (!isRedisConnected()) return null;

  const redisClient = getRedisClient();
  try {
    const data = await redisClient.get(`cache:${key}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Get cached data error:', error);
    return null;
  }
};
