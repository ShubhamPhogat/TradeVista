import "dotenv/config";
import { createClient } from "redis";
import processOrder from "./process";
import { Client } from "pg";
import { refeshViews } from "./realTimeDb/cron";
const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

refeshViews();
async function listenToQueue() {
  while (true) {
    try {
      // Block and wait for an item in the queue
      const client = createClient({
        url: process.env.REDIS_MANAGER_BACKEND_DB || "redis://127.0.0.1:6380",
      });
      await client.connect();
      const [message] = await client.brPop(message, 0); // 0 means block indefinitely
      console.log(`Received message : ${message}`);
      order = JSON.parse(message);
      insertOrder(order);
      processOrder(order);
    } catch (err) {
      console.error("Error listening to Redis queue:", err);
      break;
    }
  }
}
listenToQueue();

async function insertOrder(order) {
  try {
    await client.connect();

    const { market, orderId, userId, price, quantity, filled } = order;

    // Define the table name based on the market
    const tableName = `orders_${market.toLowerCase()}`;

    // Check if the table exists
    const tableExistsQuery = `
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_name = '${tableName}'
            );
        `;
    const tableExistsResult = await client.query(tableExistsQuery);
    const tableExists = tableExistsResult.rows[0].exists;

    // If the table does not exist, create it
    if (!tableExists) {
      const createTableQuery = `
                CREATE TABLE ${tableName} (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                time TIMESTAMP NOT NULL,
                price DOUBLE PRECISION NOT NULL,
                quantity DOUBLE PRECISION NOT NULL,
                filled BOOLEAN DEFAULT false
            );
            `;
      await client.query(createTableQuery);
      await client.query(`SELECT create_hypertable('${tableName}', 'time');`);
      console.log(`Table ${tableName} created as a hypertable.`);
      await client.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1m AS
        SELECT
            time_bucket('1 minute', time) AS bucket,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(quantity) AS volume,
            
        FROM ${tableName}
        GROUP BY bucket;
    `);

      await client.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1h AS
        SELECT
            time_bucket('1 hour', time) AS bucket,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(quantity) AS volume,
             FROM ${tableName}
        GROUP BY bucket;
    `);

      await client.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1w AS
        SELECT
            time_bucket('1 week', time) AS bucket,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(quantity) AS volume,
             FROM ${tableName}
        GROUP BY bucket;;
    `);
    }

    // Insert the order into the table
    const insertQuery = `
            INSERT INTO ${tableName} (order_id, user_id, time, price, quantity, filled)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
    const result = await client.query(insertQuery, [
      orderId,
      userId,
      new Date(),
      price,
      quantity,
      filled,
    ]);
    console.log(`Order inserted:`, result.rows[0]);
  } catch (err) {
    console.error("Error inserting order:", err);
  } finally {
    await client.end();
  }
}
