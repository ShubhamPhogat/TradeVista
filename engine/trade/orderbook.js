import { Fill, Heap, maxComparator, minComparator } from "./classes.js";

export class orderBook {
  constructor(
    market,
    bids,
    asks,
    baseAssets,
    quoteAssets,
    current_price,
    lastOrder_id
  ) {
    this.market = market || "";
    this.bids = new Heap(minComparator);
    this.asks = new Heap(maxComparator);
    this.baseAssets = baseAssets || "";
    this.quoteAssets = quoteAssets || "";
    this.current_price = current_price || "";
    this.lastOrder_id = lastOrder_id || "";
  }

  addOrder(order) {
    console.log("order added", order);
    if (order.side === "buy") {
      if (order.ioc === true && this.bids.totalVolume < order.quantity) {
        return {
          status: "failed",
          message: "not enough lots available",
          executedOrder: order,
        };
      }

      let { executedQuantity, fills, status } = this.matchBid(order);
      let { depthAsk, depthBid } = this.getDepth();
      order.filled += executedQuantity;
      if (executedQuantity === order.quantity) {
        return {
          executedOrder: order,
          status: "success",
          depthAsk: depthAsk,
          depthBid: depthBid,
          fills,
        };
      } else {
        this.asks.push(order);
      }
      return {
        fills: fills,
        status: "success",
        executedOrder: order,
        depthAsk: depthAsk,
        depthBid: depthBid,
      };
    }
    if (order.side === "sell") {
      if (order.ioc === true && this.asks.totalVolume < order.quantity) {
        return {
          status: "failed",
          message: "not enough lots available",
          executedOrder: order,
        };
      }

      let { executedQuantity, fills, status } = this.matchAsk(order);
      let { depthAsk, depthBid } = this.getDepth();
      order.filled = executedQuantity;
      if (executedQuantity === order.quantity) {
        return {
          executedOrder: order,
          status: "success",
          depthAsk: depthAsk,
          depthBid: depthBid,
          fills,
        };
      }

      this.bids.push(order);
      return {
        executedOrder: order,
        fills: fills,
        status: "success",
        depthAsk: depthAsk,
        depthBid: depthBid,
      };
    }
  }

  matchBid(order) {
    console.log("matchBid");
    if (this.bids.length === 0 || this.bids[0] > order.price) {
      return { executedQuantity: 0, fills: [], status: "failure" };
    }
    let executedQuantity = 0;
    let fills = [];
    while (true && this.bids.length > 0) {
      if (this.bids[0].cancelled) {
        this.bids.pop();
        continue;
      }
      if (this.bids.length === 0 || this.bids[0].price > order.price) break;
      let currentBid = this.bids.pop();
      let currentBidRemainingQuantity = currentBid.quantity - currentBid.fills;
      let minQuantityToExecute = Math.min(
        currentBidRemainingQuantity,
        order.quantity
      );
      executedQuantity += minQuantityToExecute;
      currentBid.fills += minQuantityToExecute;

      if (currentBid.quantity > currentBid.fills) {
        this.bids.push(currentBid);
        break;
      } else {
        fills.push(currentBid);
      }
    }

    return { executedQuantity, fills, status: "success" };
  }

  matchAsk(order) {
    if (this.asks.length === 0 || this.asks[0] < order.price) {
      return { executedQuantity: 0, fills: [], statusbar: "failure" };
    }
    let executedQuantity = 0;
    let fills = [];
    while (true && this.asks.length > 0) {
      if (this.asks[0].cancelled) {
        this.asks.pop();
        continue;
      }
      if (this.asks.length === 0 || this.asks[0].price < order.price) break;
      let currentAsk = this.asks.pop();
      let currentAskRemainingQuantity = currentAsk.quantity - currentAsk.fills;
      let minQuantityToExecute = Math.min(
        currentAskRemainingQuantity,
        order.quantity
      );
      executedQuantity += minQuantityToExecute;
      currentAsk.fills += minQuantityToExecute;

      if (currentAsk.quantity > currentAsk.fills) {
        this.asks.push(currentAsk);
        break;
      } else {
        fills.push(currentAsk);
      }
    }
    return { executedQuantity, fills, status: "success" };
  }
  getDepth() {
    const bidsMap = new Map();
    const asksMap = new Map();

    // Aggregate bids
    for (let i = 0; i < this.bids.length; i++) {
      const order = this.bids[i];
      const currentQuantity = bidsMap.get(order.price) || 0;
      bidsMap.set(order.price, currentQuantity + order.quantity);
    }

    // Aggregate asks
    for (let i = 0; i < this.asks.length; i++) {
      const order = this.asks[i];
      const currentQuantity = asksMap.get(order.price) || 0;
      asksMap.set(order.price, currentQuantity + order.quantity);
    }

    // Convert Map to Array
    const bids = Array.from(bidsMap.entries()).map(([price, quantity]) => [
      price,
      quantity,
    ]);
    const asks = Array.from(asksMap.entries()).map(([price, quantity]) => [
      price,
      quantity,
    ]);

    return {
      bids,
      asks,
    };
  }
}
