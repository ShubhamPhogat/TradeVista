import { redisManager, redisManagerToBackendDb } from "../redisManager.js";
import { order } from "./classes.js";
import { orderBook } from "./orderbook.js";

export class Engine {
  static marketEngines = new Map();
  constructor(message) {
    const { market, baseAsset, quoteAsset } = message;
    if (Engine.marketEngines.has(market)) {
      return Engine.marketEngines.get(market);
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
      Engine.marketEngines.set(market, this);
    }
  }

  process(order_id, message) {
    switch (message.type) {
      case "CREATE_ORDER":
        try {
          const { executedQuantity, fills } = this.createOrder(
            message,
            order_id
          );
          redisManager.getInstance().sendToB1(order_id, {
            type: "ORDER_PLACED",
            payload: {
              executedQuantity,
              status: "success",
              order: message,
            },
          });
        } catch (e) {
          console.log("error in placing the order: " + e);
          redisManager.getInstance().sendToB1(message.order_id, {
            type: "ORDER_CANCELLED",
            payload: {
              status: "failed",
            },
          });
        }

        break;
      case "CANCEL_ORDER":
        try {
          const cancelorder_id = message.order_id;
          const side = message.side;
          if (side === "buy") {
            let cancelledOrder = null;
            let cancelledOrderIndex = null;
            for (let i = 0; i < this.orderBook.asks.length; i++) {
              if (this.orderBook.asks[i].order_id === cancelorder_id) {
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
              redisManager.getInstance().sendToB1(cancelledOrder.order_id, {
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
              if (this.orderBook.bids[i].order_id === cancelorder_id) {
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
              redisManager.getInstance().sendToB1(cancelledOrder.order_id, {
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
          redisManager.getInstance().sendToB1(message.order_id, {
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

  createOrder(message, order_id) {
    const { market, side, quantity, user_id, price, ioc } = message.data;

    const newOrder = new order(
      market,
      side,
      quantity,
      user_id,
      order_id,
      "0",
      price,
      ioc
    );
    const { depthAsk, depthBid, executedOrder, fills, status } =
      this.orderBook.addOrder(newOrder);

    this.Dborders(fills, executedOrder);
    this.ApiOrders(executedOrder, fills);

    this.publishDepth(depthAsk, depthBid, executedOrder.market);
  }

  async Dborders(fills, completedOrder) {
    //code to save the order in the database
    //executedQuantity, fills, status, newOrder
    const redisManagerToBackendDbInstance =
      await redisManagerToBackendDb.getInstance();
    redisManagerToBackendDbInstance.sendToBackendDb(completedOrder);
    fills.forEach((o) => {
      redisManagerToBackendDbInstance.sendToBackendDb(o);
    });
  }
  async ApiOrders(newOrder, fills) {
    //code to send the order to the API
    //newOrder
    const redisManagerInstance = redisManager.getInstance();
    fills.forEach((filledOrder) => {
      redisManagerInstance.sendToB1(filledOrder.order_id, {
        type: "ORDER_FILLED",
        payload: {
          executedQuantity: filledOrder.executedQuantity,
          order: filledOrder,
          status: "success",
        },
      });
    });

    redisManagerInstance.sendToB1(newOrder.order_id, {
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
