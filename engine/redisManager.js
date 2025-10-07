import { createClient } from "redis";

export class redisManager {
  constructor() {
    if (redisManager.instance) {
      return redisManager.instance;
    } else {
      redisManager.instance = this;
    }
  }
  async init() {
    if (!this.client) {
      try {
        this.client = new createClient({ url: "redis://127.0.0.1:6379" });

        await this.client.connect();
        console.log("Connected to Redis to else  ");
      } catch (error) {
        console.log("error in connecting to redis in redismanager", error);
      }
    }
  }
  static async getInstance() {
    if (!redisManager.instance) {
      redisManager.instance = new redisManager();
      await redisManager.instance.init();
      return redisManager.instance;
    } else {
      return redisManager.instance;
    }
  }

  async sendToB1(clientId, message) {
    // console.log("this is client id", clientId, message);
    if (!this.client || !this.client.isOpen) {
      throw new Error("Redis client is not connected.");
    }
    try {
      await this.client.publish(clientId, JSON.stringify(message));
      console.log(`Message sent to clientId ${clientId}:`, message);
    } catch (error) {
      console.error("Error in sending message to Redis:", error);
    }
  }
}

export class RedisManagerToBackendDb {
  constructor() {
    if (RedisManagerToBackendDb.instance) {
      return RedisManagerToBackendDb.instance;
    }
    RedisManagerToBackendDb.instance = this;
  }

  async init() {
    if (!this.publisher) {
      this.publisher = createClient({ url: "redis://127.0.0.1:6380" });

      await this.publisher.connect();
    }
  }

  static async getInstance() {
    if (!RedisManagerToBackendDb.instance) {
      const instance = new RedisManagerToBackendDb();
      await instance.init(); // Ensure async initialization completes
    }
    return RedisManagerToBackendDb.instance;
  }

  async sendToDb(message) {
    console.log("Message to publish:", message);

    if (this.publisher?.isOpen) {
      try {
        // Push the message to Redis queue
        const formattedMessage = {
          type: "CREATE_ORDER",
          order_id: message.order_id,
          data: {
            market: message.market,
            side: message.side,
            quantity: message.quantity,
            user_id: message.user_id,
            price: message.price,
            fills: String(message.filled),
            cancelled: message.cancelled,
            ioc: message.ioc,
            quoteAsset: "USD",
            baseAsset: message.market,
          },
        };
        await this.publisher.lPush(
          "message",
          JSON.stringify({ formattedMessage })
        );
       
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
