import dotenv from "dotenv";
dotenv.config({ path: "/.env" });

import { createClient } from "redis";
import { processOrder } from "./process.js";
import { refeshViews } from "./realTimeDb/cron.js";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  user: "myuser",
  host: "localhost",
  password: "1234567VISTA",
  port: 5432,
});

// Global Redis client
let redisClient = null;

async function createRedisClient() {
  const client = createClient({
    url: "redis://127.0.0.1:6380",
    socket: {
      reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
      connectTimeout: 10000,
    },
  });

  client.on("error", (error) => {
    console.error("Redis error:", error);
    // Don't reconnect on authentication errors
    if (error.message.includes("WRONGPASS")) {
      console.error("Redis authentication failed. Check credentials.");
      process.exit(1);
    }
  });

  client.on("end", async () => {
    console.log("Redis connection closed. Attempting reconnect...");
    await reconnectRedis();
  });

  return client;
}

async function reconnectRedis() {
  try {
    if (redisClient) {
      await redisClient.quit();
    }
    redisClient = await createRedisClient();
    await redisClient.connect();
  } catch (error) {
    console.error("Redis reconnection failed:", error);
    // Implement exponential backoff
    setTimeout(reconnectRedis, 5000);
  }
}

async function insertOrder(order, order_id) {
  const client = await pool.connect();
  try {
    console.log("Inserting order", order);
    const { market, user_id, price, quantity, filled } = order;
    const tableName = `orders_${market.toLowerCase()}`;

    // Check if table exists

    const tableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = $1
      );
    `;
    const tableExistsResult = await client.query(tableExistsQuery, [tableName]);
    const tableExists = tableExistsResult.rows[0].exists;

    if (!tableExists) {
      await client.query("BEGIN");
      try {
        // Create table and views in a transaction
        const createTableQuery = `
          CREATE TABLE ${tableName} (
            id SERIAL,
        order_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        time TIMESTAMP NOT NULL,
        price DOUBLE PRECISION NOT NULL,
        quantity DOUBLE PRECISION NOT NULL,
        filled DOUBLE PRECISION DEFAULT 0,
        PRIMARY KEY (id, time)  -- Composite primary key
          );
        `;
        await client.query(createTableQuery);
        await client.query(
          `SELECT create_hypertable('${tableName}', 'time',if_not_exists => TRUE);`
        );

        // Create materialized views
        const viewQueries = [
          `CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1m_${market.toLowerCase()} AS
           SELECT time_bucket('1 minute', time) AS bucket,
           first(price, time) AS open,
           max(price) AS high,
           min(price) AS low,
           last(price, time) AS close,
           sum(quantity) AS volume
           FROM ${tableName}
           GROUP BY bucket;`,
          // Add other view creation queries...
        ];

        for (const query of viewQueries) {
          await client.query(query);
        }

        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      }
    }

    // Insert the order
    const insertQuery = `
      INSERT INTO ${tableName} (order_id, user_id, time, price, quantity, filled)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const result = await client.query(insertQuery, [
      order_id,
      String(user_id),
      new Date(),
      price,
      quantity,
      filled || 0,
    ]);

    return result.rows[0];
  } finally {
    client.release();
  }
}

async function main() {
  const redisClient = createClient();
  await redisClient.connect({ url: "redis://127.0.0.1:6380" });
  console.log("connected to redis");

  while (true) {
    const req = await redisClient.brPop("message", 0);
    if (!req) {
    } else {
      const { key, element } = req;
      const response = JSON.parse(element);
      console.log(response);
      try {
        const op2 = await insertOrder(response.message.data, response.order_id);
        // const op1 = await processOrder(response);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

// Handle process termination
process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Cleaning up...");
  if (redisClient) {
    await redisClient.quit();
  }
  await pool.end();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Received SIGINT. Cleaning up...");
  if (redisClient) {
    await redisClient.quit();
  }
  await pool.end();
  process.exit(0);
});

// Start the queue listener
// listenToQueue();
main();
refeshViews();
