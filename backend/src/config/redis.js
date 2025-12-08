import { createClient } from 'redis';

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
      }
    });

    redisClient.on('error', (err) => {
      console.log('Redis Client Error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('Redis Connected');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.log('Redis connection failed. Running without cache:', error.message);
    return null;
  }
};

const getRedisClient = () => redisClient;

const isRedisConnected = () => redisClient && redisClient.isOpen;

export { connectRedis, getRedisClient, isRedisConnected };
