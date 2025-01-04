const { createClient } = require("redis");
const { v4 } = require("uuid");

class redisManager {
  constructor() {
    if (this.instance) {
      return this.instance;
    } else {
      this.client = createClient();
      this.publisher = createClient();

      this.client.connect();
      this.publisher.connect();
      redisManager.instance = this;
    }
  }
  static getInstance() {
    if (!redisManager.instance) {
      return (redisManager.instance = new redisManager());
    } else {
      return redisManager.instance;
    }
  }

  createAndWait(message) {
    const user_id = v4();
    this.publisher.lPush(
      "message",
      JSON.parse({ clientId: user_id, message: message })
    );
    return new Promise((resolve) => {
      this.client.subscribe(id, (message) => {
        this.client.unsubscribe(id);
        resolve(JSON.parse(message));
      });
    });
  }
}

module.exports = redisManager;
