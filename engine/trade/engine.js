import { redisManager, RedisManagerToBackendDb } from "../redisManager.js";
import { order } from "./classes.js";
import { orderBook } from "./orderbook.js";
import { createClient } from "redis";

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

  async process(order_id, message) {
    console.log("engine process");
    try {
      switch (message.type) {
        case "CREATE_ORDER":
          try {
            const redisManagerInstance = await redisManager.getInstance();

            const { executedOrder } = await this.createOrder(message, order_id);
            console.log("this is order executed ", executedOrder);

            redisManagerInstance.sendToB1(order_id, {
              type: "ORDER_PLACED",
              payload: {
                executedOrder,
                status: "success",
              },
            });
          } catch (e) {
            console.log("error in placing the order: " + e);
            const redisManagerInstance = await redisManager.getInstance();
            redisManagerInstance.sendToB1(order_id, {
              type: "ORDER_CANCELLED",
              payload: {
                status: "failed",
              },
            });
          }

          break;
        case "CANCEL_ORDER":
          const redisManagerInstance = await redisManager.getInstance();
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
                redisManagerInstance.sendToB1(order_id, {
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
                redisManagerInstance.sendToB1(order_id, {
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
            const redisManagerInstance = await redisManager.getInstance();
            redisManagerInstance.sendToB1(order_id, {
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
    } catch (error) {
      console.log("error processing", error);
    }
  }

  async createOrder(message, order_id) {
    try {
      console.log("create order", message, order_id);
      const { market, side, quantity, user_id, price, ioc } = message.data;

      // Validate required fields
      if (!market || !side || !quantity || !user_id || !order_id) {
        throw new Error("Missing required order parameters");
      }

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

      console.log("Order book depths:", executedOrder);

      if (executedOrder) {
        await this.processOrdersToDb(fills, executedOrder);
        try {
          const redisManager = await RedisManagerToBackendDb.getInstance();
          // Send executed order first
          await redisManager.sendToDb(executedOrder);

          // Then send all fills if they exist
          if (fills && fills.length > 0) {
            for (const fill of fills) {
              await redisManager.sendToDb(fill);
            }
            await this.ApiOrders(executedOrder, fills);
          }
        } catch (error) {
          console.error("Redis operation failed:", error);
          // Continue execution even if Redis fails
        }
      }

      if (fills.length > 0) {
        await this.ApiOrders(executedOrder, fills);
      }

      // this.publishDepth(depthAsk, depthBid, executedOrder.market);
      return { executedOrder: executedOrder };
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async processOrdersToDb(fills, completedOrder) {
    try {
      const redisManager = await RedisManagerToBackendDb.getInstance();

      // Send completed order first
      await redisManager.sendToDb(completedOrder);

      // Process fills sequentially to maintain order
      for (const fill of fills) {
        await redisManager.sendToDb(fill);
      }
    } catch (error) {
      console.error("Error processing orders to DB:", error);
      throw error;
    }
  }
  async ApiOrders(newOrder, fills) {
    //code to send the order to the API
    //newOrder
    const redisManagerInstance = await redisManager.getInstance();
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
  }

  publishDepth(depthAsk, depthBid, market) {
    emit(depthAsk, depthBid, market);
  }
}

const emit = async (depthAsk, depthBid, market) => {
  try {
    const client = createClient({ url: "redis://127.0.0.1:6381" });
    await client.connect();
    client.publish(market, JSON.stringify({ asks: depthAsk, bids: depthBid }));
  } catch (error) {
    console.error(error);
  }
};
