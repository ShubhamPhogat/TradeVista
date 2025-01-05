import "dotenv/config";
import { createClient } from "redis";
import processOrder from "./process";
async function listenToQueue() {
  while (true) {
    try {
      // Block and wait for an item in the queue
      const client = createClient({
        url: process.env.REDIS_MANAGER_BACKEND_DB,
      });
      await client.connect();
      const [message] = await client.brPop(message, 0); // 0 means block indefinitely
      console.log(`Received message : ${message}`);
      order = JSON.parse(message);
      insertOrder(order);
      processOrder(order);

      // Process the message (add your logic here)
    } catch (err) {
      console.error("Error listening to Redis queue:", err);
      break;
    }
  }
}
listenToQueue();

const insertOrder = async (order) => {
  const query = `
      INSERT INTO orders (market, side, quantity, user_id, order_id, filled, price, cancelled)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

  const values = [
    order.market,
    order.side,
    order.quantity,
    order.user_id,
    order.order_id,
    order.filled,
    order.price,
    order.cancelled,
  ];

  try {
    const result = await pool.query(query, values);
    console.log("Order inserted:", result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error("Error inserting order:", err);
    throw err;
  }
};
