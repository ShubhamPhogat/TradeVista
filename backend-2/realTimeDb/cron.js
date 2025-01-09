import { Client } from "pg";
const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

export const refeshViews = async () => {
  try {
    await client.connect();
    setInterval(async () => {
      await client.query("REFESH MATERIALIZED VIEW Klines_1m");
      await client.query("REFESH MATERIALIZED VIEW Klines_1h");
      await client.query("REFESH MATERIALIZED VIEW Klines_1d");
      console.log("Views refreshed");
    }, 1000 * 10);
  } catch (error) {
    console.error("error in refreshing view", error);
  }
};
