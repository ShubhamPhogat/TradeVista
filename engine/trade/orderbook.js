import { Fill, Heap, maxComparator, minComparator } from "./classes";

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
    this.bids = bids || new Heap(minComparator);
    this.asks = asks || new Heap(maxComparator);
    this.baseAssets = baseAssets || "";
    this.quoteAssets = quoteAssets || "";
    this.current_price = current_price || "";
    this.lastOrder_id = lastOrder_id || "";
  }

  addOrder(order) {
    if (order.type === "buy") {
      if (order.ioc === true && this.bids.totalVolume < order.quantity) {
        return {
          status: "failed",
          message: "not enough lots available",
          ...order,
        };
      }

      let { executedQuantity, fills, status } = this.matchBid(order);
      if (executedQuantity === order.quantity) {
        return {
          ...order,
          filledQuantity: executedQuantity,
          leftQuantity: 0,
          status: "success",
        };
      } else {
        order.quantity -= executedQuantity;
        this.asks.push(order);
      }
      return {
        executedQuantity: executedQuantity,
        fills: fills,
        status: "success",
      };
    }
    if (order.type === "sell") {
      if (order.ioc === true && this.asks.totalVolume < order.quantity) {
        return {
          status: "failed",
          message: "not enough lots available",
          ...order,
        };
      }

      let { executedQuantity, fills, status } = this.matchAsk(order);

      if (executedQuantity === order.quantity) {
        return {
          ...order,
          filledQuantity: executedQuantity,
          leftQuantity: 0,
          status: "success",
        };
      }
      order.quantity -= executedQuantity;
      this.bids.push(order);
      return {
        executedQuantity: executedQuantity,
        fills: fills,
        status: "success",
      };
    }
  }

  matchBid(order) {
    if (this.bids.length === 0 || this.bids[0] > order.price) {
      return { executedQuantity: 0, fills: [], status: "failure" };
    }
    let executedQuantity = 0;
    let fills = [];
    while (true) {
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
        let filledBid = new Fill(
          currentBid.id,
          currentBid.price,
          currentBid.quantity,
          order.id
        );
        fills.push(filledBid);
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
    while (true) {
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
        let filledAsk = new Fill(
          currentAsk.id,
          currentAsk.price,
          currentAsk.quantity,
          order.id
        );
        fills.push(filledAsk);
      }
    }
    return { executedQuantity, fills, status: "success" };
  }
}
