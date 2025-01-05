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

export class redisManagerToBackendDb {
  constructor() {
    if (redisManagerToBackendDb.instance) {
      return redisManagerToBackendDb.instance;
    } else {
      this.client = new RedisClient({
        url: process.env.REDIS_MANAGER_BACKEND_DB,
      });

      this.client.connect();

      redisManagerToBackendDb.instance = this;
    }
  }
  static getInstance() {
    if (!redisManagerToBackendDb.instance) {
      return (redisManagerToBackendDb.instance = new redisManagerToBackendDb());
    } else {
      return redisManagerToBackendDb.instance;
    }
  }

  sendToBackendDb(message, clientId) {
    this.client.publish(clientId, JSON.stringify(message));
  }
}
