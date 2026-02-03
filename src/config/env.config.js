import dotenv from "dotenv";
dotenv.config()

const env_config = {
  MONGO_URI: process.env.MONGO_URI,
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
  REDIS_URL: process.env.REDIS_URL,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET?.trim() || "08a5c43d0c80ebc15013fd0e958509b4",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET?.trim() || "ac7e77786714c951fd33a8fb6ba8be12",
};

console.log("[ENV] Loaded config:", {
  hasMongoUri: !!env_config.MONGO_URI,
  hasAccessSecret: !!env_config.ACCESS_TOKEN_SECRET,
  hasRefreshSecret: !!env_config.REFRESH_TOKEN_SECRET,
  hasRedis: !!env_config.REDIS_URL,
});

export default env_config;

