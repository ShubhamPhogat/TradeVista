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
