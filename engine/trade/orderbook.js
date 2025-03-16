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
    this.bids = new Heap(maxComparator);
    this.asks = new Heap(minComparator);
    this.baseAssets = baseAssets || "";
    this.quoteAssets = quoteAssets || "";
    this.current_price = current_price || "";
    this.lastOrder_id = lastOrder_id || "";
  }

  addOrder(order) {
    if (order.side === "buy") {
      if (order.ioc === true && this.bids.totalVolume < order.quantity) {
        return {
          status: "failed",
          message: "not enough lots available",
          executedOrder: order,
        };
      }

      let { executedQuantity, fills, status } = this.matchAsk(order);
      console.log("executed Quantity ", executedQuantity);
      console.log("fills are", fills);
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
        this.bids.push(order);
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

      let { executedQuantity, fills, status } = this.matchBid(order);
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
      } else {
        this.asks.push(order);
        return {
          executedOrder: order,
          fills: fills,
          status: "success",
          depthAsk: depthAsk,
          depthBid: depthBid,
        };
      }
    }
  }

  matchBid(order) {
    console.log("length", this.bids.heap.length, order);
    if (this.bids.heap.length === 0 || this.bids.heap[0] < order.price) {
      console.log("order added to asks", this.bids.heap.length);
      return { executedQuantity: 0, fills: [], status: "failure" };
    }
    let executedQuantity = 0;
    let fills = [];
    while (true && this.bids.heap.length > 0) {
      console.log("running ", this.bids.heap.length);
      if (this.bids.heap[0].cancelled) {
        this.bids.pop();
        continue;
      }
      if (
        this.bids.heap.length === 0 ||
        this.bids.heap[0].price < order.price ||
        order.quantity === executedQuantity
      )
        break;
      let currentBid = this.bids.pop();
      let currentBidRemainingQuantity = currentBid.quantity - currentBid.filled;
      let minQuantityToExecute = Math.min(
        currentBidRemainingQuantity,
        order.quantity - executedQuantity
      );
      executedQuantity += minQuantityToExecute;
      currentBid.filled += minQuantityToExecute;

      if (currentBid.quantity > currentBid.filled) {
        this.bids.push(currentBid);
        break;
      } else {
        fills.push(currentBid);
      }
    }

    return { executedQuantity, fills, status: "success" };
  }

  matchAsk(order) {
    if (this.asks.heap.length === 0 || this.asks[0] > order.price) {
      console.log("order added to bids", order);
      return { executedQuantity: 0, fills: [], status: "failure" };
    }
    let executedQuantity = 0;
    let fills = [];
    while (true && this.asks.heap.length > 0) {
      if (this.asks.heap[0].cancelled) {
        this.asks.pop();
        continue;
      }
      if (
        this.asks.heap.length === 0 ||
        this.asks.heap[0].price > order.price ||
        order.quantity === executedQuantity
      ) {
        break;
      }
      let currentAsk = this.asks.pop();
      console.log("popend ask ", currentAsk.quantity, currentAsk.filled);
      let currentAskRemainingQuantity = currentAsk.quantity - currentAsk.filled;
      let minQuantityToExecute = Math.min(
        currentAskRemainingQuantity,
        order.quantity - executedQuantity
      );
      executedQuantity += minQuantityToExecute;
      currentAsk.filled += minQuantityToExecute;

      if (currentAsk.quantity > currentAsk.filled) {
        this.asks.push(currentAsk);
        break;
      } else {
        fills.push(currentAsk);
      }
    }
    console.log("engine compute", executedQuantity);
    return { executedQuantity, fills, status: "success" };
  }
  getDepth() {
    const bidsMap = new Map();
    const asksMap = new Map();

    // Aggregate bids
    for (let i = 0; i < this.bids.heap.length; i++) {
      const order = this.bids.heap[i];
      const currentQuantity = bidsMap.get(order.price) || 0;
      bidsMap.set(order.price, currentQuantity + order.quantity);
    }

    // Aggregate asks
    for (let i = 0; i < this.asks.heap.length; i++) {
      const order = this.asks.heap[i];
      const currentQuantity = asksMap.get(order.price) || 0;
      asksMap.set(order.price, currentQuantity + order.quantity);
    }

    // Convert Map to Array
    const depthBid = Array.from(bidsMap.entries()).map(([price, quantity]) => [
      price,
      quantity,
    ]);
    const depthAsk = Array.from(asksMap.entries()).map(([price, quantity]) => [
      price,
      quantity,
    ]);

    return {
      depthAsk,
      depthBid,
    };
  }
}
