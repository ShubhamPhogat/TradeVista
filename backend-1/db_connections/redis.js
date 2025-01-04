const Redis = require("ioredis");
// Create a Redis client to connect to the local Redis instance
const redis = new Redis({
  host: "localhost", // Redis server address
  port: 6379, // Redis default port
  db: 0, // Use default DB 0
});

module.exports = redis;
