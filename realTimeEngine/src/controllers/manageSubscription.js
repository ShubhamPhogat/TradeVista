import { createClient } from "redis";

export class subsriptionManager {
  constructor() {
    if (subsriptionManager.instacne) {
      return subsriptionManager.instacne;
    }

    subsriptionManager.instacne = this;
  }

  async init() {
    if (!this.client) {
      this.userSubscription = new Map();
      this.marketSubscription = new Map();
      this.client = createClient({ url: "redis://127.0.0.1:6381" });
      await this.client.connect();
    }
  }

  static async getInstance() {
    if (!subsriptionManager.instacne) {
      subsriptionManager.instacne = new subsriptionManager();
      this.init();
    }
    return subsriptionManager.instacne;
  }

  addSubscription(userId, market) {
    if (this.userSubscription.has(userId)?.includes(market)) {
      return;
    }
    this.userSubscription.set(
      userId,
      (this.userSubscription.get(userId) || []).push(market)
    );
    this.marketSubscription.set(
      market,
      (this.marketSubscription.get(market) || []).push(userId)
    );
    if (this.marketSubscription.get(market).length === 1) {
      this.client.subscribe(market, this.redisCallbackHandler);
    }
  }

  redisCallbackHandler(channel, message) {
    let response = JSON.parse(message);
    this.marketSubscription.get(channel).forEach((subscriberId) => {
      userManager.getInstance().getUser(subscriberId).emit(response);
    });
  }

  cancelSubscription(userId, market) {
    if (
      this.userSubscription.has(userId) &&
      this.userSubscription.get(userId).includes(market)
    ) {
      const index = this.userSubscription.get(userId).indexOf(market);
      this.userSubscription.get(userId).splice(index, 1);
      if (
        this.marketSubscription.has(market) &&
        this.marketSubscription.get(market).includes(userId)
      ) {
        const index = this.marketSubscription.get(market).indexOf(userId);
        this.marketSubscription.get(market).splice(index, 1);
      }
      if (this.marketSubscription.get(market)?.length === 0) {
        this.client.unsubscribe(market);
      }
    }

    userLeft(userId);
    {
      if (this.userSubscription.has(userId)) {
        this.userSubscription.get(userId).forEach((m) => {
          if (
            this.marketSubscription.has(m) &&
            this.marketSubscription.get(m).length === 1
          ) {
            this.client.unsubscribe(m);
          }
        });
        this.userSubscription.delete(userId);
      }
    }
  }
}
