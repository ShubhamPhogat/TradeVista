import pkg from "pg";
const { Client } = pkg;
const client = new Client({
  user: "myuser",
  host: "localhost",
  password: "1234567VISTA",
  port: 5432,
});

export const refeshViews = async () => {
  try {
    await client.connect();
    setInterval(async () => {
      await client.query("REFRESH MATERIALIZED VIEW Klines_1m_btc");
      // await client.query("REFESH MATERIALIZED VIEW Klines_1h");
      // await client.query("REFESH MATERIALIZED VIEW Klines_1d");
      console.log("Views refreshed");
    }, 1000 * 10);
  } catch (error) {
    console.error("error in refreshing view", error);
  }
};
