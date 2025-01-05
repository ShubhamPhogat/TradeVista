import { redisManager, redisManagerToBackendDb } from "../redisManager";
import { order } from "./classes";
import { orderBook } from "./orderbook";

export class Engine {
  static marketEngines = new map();
  constructor(message) {
    const { market, baseAsset, quoteAsset } = message;
    if (this.marketEngines.has(market)) {
      return this.marketEngines.get(market);
    } else {
      this.market = market;
      this.baseAsset = baseAsset;
      this.quoteAsset = quoteAsset;
      this.orderBook = new orderBook(
        market,
        [],
        [],
        baseAsset,
        quoteAsset,
        "0",
        "1"
      );
      this.marketEngines.set(market, this);
    }
  }

  process(message) {
    switch (message.type) {
      case "CREATE_ORDER":
        try {
          const { executedQuantity, fills, orderId } =
            this.createOrder(message);
          redisManager.getInstance().sendToB1(orderId, {
            type: "ORDER_PLACED",
            payload: {
              executedQuantity,
              status: "success",
              order: message,
            },
          });
        } catch (e) {
          console.log("error in placing the order: " + e);
          redisManager.getInstance().sendToB1(message.orderId, {
            type: "ORDER_CANCELLED",
            payload: {
              executedQuantity,
              fills,
              status: "failed",
            },
          });
        }

        break;
      case "CANCEL_ORDER":
        try {
          const cancelOrderId = message.orderId;
          const side = message.side;
          if (side === "buy") {
            let cancelledOrder = null;
            let cancelledOrderIndex = null;
            for (let i = 0; i < this.orderBook.asks.length; i++) {
              if (this.orderBook.asks[i].orderId === cancelOrderId) {
                cancelledOrder = this.orderBook.asks[i];
                cancelledOrderIndex = i;
                break;
              }
            }
            if (cancelledOrder === null) {
              console.log("Order not found to cancel");
              throw Error("order not found");
            } else {
              this.orderBook.asks[cancelledOrderIndex].cancelled = true;
              redisManager.getInstance().sendToB1(cancelledOrder.orderId, {
                type: "ORDER_CANCELLED",
                payload: {
                  executedQuantity: cancelledOrder.quantity,
                  fills: cancelledOrder.fills,
                  status: "cancelled",
                },
              });
            }
          }
          if (side === "sell") {
            let cancelledOrder = null;
            let cancelledOrderIndex = null;
            for (let i = 0; i < this.orderBook.bids.length; i++) {
              if (this.orderBook.bids[i].orderId === cancelOrderId) {
                cancelledOrder = this.orderBook.bids[i];
                cancelledOrderIndex = i;
                break;
              }
            }
            if (cancelledOrder === null) {
              console.log("Order not found to cancel");
              throw Error("order not found");
            } else {
              this.orderBook.bids[cancelledOrderIndex].cancelled = true;
              redisManager.getInstance().sendToB1(cancelledOrder.orderId, {
                type: "ORDER_CANCELLED",
                payload: {
                  executedQuantity: cancelledOrder.quantity,
                  fills: cancelledOrder.fills,
                  status: "cancelled",
                },
              });
            }
          }
        } catch (e) {
          console.log("error in placing the order: " + e);
          redisManager.getInstance().sendToB1(message.orderId, {
            type: "ORDER_CANCELLED",
            payload: {
              executedQuantity,
              fills,
              status: "failed",
            },
          });
        }

      default:
        break;
    }
  }

  createOrder(message) {
    const { market, side, quantity, user_id, price, orderId } = message.data;

    const newOrder = new order(
      market,
      side,
      quantity,
      user_id,
      orderId,
      "0",
      price
    );

    const { depthAsk, depthBid, executedOrder, fills, status } =
      this.orderBook.addOrder(newOrder);

    this.Dborders(fills, executedOrder);
    this.ApiOrders(executedOrder);
    this.publishDepth(depthAsk, depthBid, executedOrder.market);
  }

  Dborders(fills, completedOrder) {
    //code to save the order in the database
    //executedQuantity, fills, status, newOrder
    redisManagerToBackendDb.getInstance().sendtoBackendDb(completedOrder);
    fills.forEach((o) => {
      redisManagerToBackendDb.getInstance().sendtoBackendDb(o);
    });
  }
  ApiOrders(newOrder) {
    //code to send the order to the API
    //newOrder
    redisManager.getInstance().sendToB1(newOrder.orderId, {
      type: "ORDER_PLACED",
      payload: {
        executedQuantity: newOrder.executedQuantity,
        order: newOrder,
        status: "success",
      },
    });
  }

  publishDepth(depthAsk, depthBid, market) {
    emit(depthAsk, depthBid, market);
  }
}

const emit = async (depthAsk, depthBid, market) => {
  try {
    const client = createClient({
      url: process.env.REDIS_MANAGER_REALTIME_ENGINE,
    });
    await client.connect();
    client.publish(market, JSON.stringify({ asks: depthAsk, bids: depthBid }));
  } catch (error) {
    console.error(error);
  }
};
