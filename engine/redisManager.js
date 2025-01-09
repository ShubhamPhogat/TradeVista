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
        this.client = new createClient({ url: "redis://127.0.0.1:6381" });

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
      redisManager.instance.init();
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
      redisManagerToBackendDb.instance = this;
    }
  }

  async init() {
    if (!this.client) {
      try {
        this.client = new createClient({ url: "redis://127.0.0.1:6380" });
        await this.client.connect();
        console.log("Connected to Redis to db  ");
      } catch (error) {
        console.log(
          "error in connecting to redis in redismanagertobackenddb",
          error
        );
      }
    }
  }

  static async getInstance() {
    if (!redisManagerToBackendDb.instance) {
      redisManagerToBackendDb.instance = new redisManagerToBackendDb();
      redisManagerToBackendDb.instance.init();
    } else {
      return redisManagerToBackendDb.instance;
    }
  }

  sendToBackendDb(message) {
    if (this.client.isOpen) {
      this.client.lPush("message", JSON.stringify(message));
      console.log("published", message);
    }
  }
}
