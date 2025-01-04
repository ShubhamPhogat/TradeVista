export class redisManager {
  constructor() {
    if (redisManager.instance) {
      return redisManager.instance;
    } else {
      this.client = new RedisClient();

      this.client.connect();

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

  sendToB1(message, clientId) {
    this.client.publish(clientId, JSON.stringify(message));
  }
}
