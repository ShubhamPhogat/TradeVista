import { v4 } from "uuid";
import { subsriptionManager } from "./manageSubscription";
export class userManager {
  constructor() {
    if (userManager.instance) {
      return userManager.instance;
    }
    this.users = new Map();
    userManager.instance = this;
  }

  getInstance() {
    if (!userManager.instance) {
      return new userManager();
    }
    return userManager.instance;
  }

  addUser(ws) {
    let userId = v4();
    this.users.set(userId, new UserActivation(userId, ws));

    this.deregisterOnClose(ws, userId);
  }

  deregisterOnClose(ws, userId) {
    ws.on("close", () => {
      this.users.delete(userId);
      subsriptionManager.getInstance().userLeft(userId);
    });
  }

  getUser(id) {
    return this.users.get(id);
  }
}
