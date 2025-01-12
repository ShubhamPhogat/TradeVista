const { createClient } = require("redis");
const { v4 } = require("uuid");

class RedisManager {
  constructor() {
    if (RedisManager.instance) {
      return RedisManager.instance;
    }
    RedisManager.instance = this;
  }

  async init() {
    if (!this.client || !this.publisher) {
      this.client = createClient({ url: "redis://127.0.0.1:6379" });
      this.publisher = createClient({ url: "redis://127.0.0.1:6379" });

      await this.client.connect();
      await this.publisher.connect();
    }
  }

  static async getInstance() {
    if (!RedisManager.instance) {
      const instance = new RedisManager();
      await instance.init(); // Ensure async initialization completes
    }
    return RedisManager.instance;
  }

  async createAndWait(message) {
    console.log("Message to publish:", message);
    const order_id = v4(); // Unique identifier for the operation

    if (this.publisher?.isOpen) {
      try {
        // Push the message to Redis queue
        await this.publisher.lPush(
          "message",
          JSON.stringify({ order_id, message })
        );
        console.log("Published:", message);

        return new Promise((resolve, reject) => {
          // Define cleanup logic
          const cleanup = () => {
            this.client.unsubscribe(order_id); // Unsubscribe from the channel
            this.client.removeAllListeners("message"); // Remove all listeners for messages
            this.client.removeAllListeners("error"); // Remove all listeners for errors
          };

          // Subscribe to the unique channel
          this.client.subscribe(order_id, (response) => {
            try {
              console.log("Response received:", response);
              resolve(JSON.parse(response)); // Resolve the promise with the response
            } catch (error) {
              console.error("Error parsing response:", error);
              reject(error);
            } finally {
              cleanup(); // Cleanup after receiving the response
            }
          });

          // Handle Redis client errors
          this.client.on("error", (err) => {
            console.error("Redis subscription error:", err);
            reject(err); // Reject the promise on error
            cleanup(); // Cleanup after an error
          });
        });
      } catch (err) {
        console.error("Error in publishing message:", err);
        throw err; // Re-throw the error to the caller
      }
    } else {
      console.error("Publisher is not open.");
      throw new Error("Publisher is not open.");
    }
  }
}

module.exports = RedisManager;
