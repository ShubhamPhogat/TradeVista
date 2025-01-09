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
    console.log(message);
    const order_id = v4();

    if (this.publisher?.isOpen) {
      await this.publisher.lPush(
        "message",
        JSON.stringify({ order_id, message })
      );
      console.log("published", message);
      return new Promise((resolve) => {
        this.client.subscribe(order_id, (message) => {
          resolve(JSON.parse(message));
        });
        this.client.on("error", (err) => {
          console.error("Error subscribing to Redis queue:", err);
        });
        //close the connection
        // this.client.quit();
      });
    } else {
      console.log("publisher not open");
    }
  }
}

module.exports = RedisManager;
