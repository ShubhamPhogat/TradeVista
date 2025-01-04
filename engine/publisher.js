const redis = require("./connections/redis");

async function getSubscriptions() {
  try {
    const channels = await redis.pubsub("channels"); // Fetch active subscriptions
    console.log("Active Subscriptions:", channels);
  } catch (err) {
    console.error("Error fetching subscriptions:", err);
  }
}

module.exports = getSubscriptions;
