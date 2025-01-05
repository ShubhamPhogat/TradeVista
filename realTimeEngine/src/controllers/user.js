import { subsriptionManager } from "./manageSubscription";

export class user {
  constructor(ws, id) {
    this.ws = ws;
    this.id = id;
    this.addListener();
  }

  emit(message) {
    this.ws.send(JSON.stringify(message));
  }

  addListener() {
    this.ws.on("message", (message) => {
      const req = JSON.parse(message);
      if (req.method === "SUBSCRIBE") {
        const market = req.params;
        subsriptionManager.getInstance().addSubscription(this.id, market);
      } else if (req.method === "UNSUBSCRIBE") {
        const market = req.params;
        subsriptionManager.getInstance().cancelSubscription(this.id, market);
      }
    });
  }
}
