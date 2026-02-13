import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis client error", err));
redisClient.on("connect", () => console.log("Redis Client Connected"));
redisClient.on("ready", () => console.log("Redis Client Ready"));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      console.log("Redis Client Connected Successfully");
    } catch (error) {
      console.error("Could not connect to Redis", error);
    }
  }
};

connectRedis();

export default redisClient;
