const express = require("express");
const klineRouter = express.Router();
const { Client } = require("pg");
const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

klineRouter.get("/", async (req, res) => {
  // logic to fetch kline data from your database
  const { market, startTime, endTime, interval } = req.query;

  let query = null;
  switch (interval) {
    case "1m":
      query = `SELECT * FROM klines_1m WHERE bucket >= $1 AND bucket <= $2`;

      break;

    case "1h":
      query = `SELECT * FROM klines_1h WHERE bucket >= $1 AND bucket <= $2`;
      break;

    case "1d":
      query = `SELECT * FROM klines_1d WHERE bucket >= $1 AND bucket <= $2`;
    default:
      res.status(404).send({ message: "invalid interval" });
      break;
  }
  try {
    const result = await client.query(query, [
      new Date(startTime * 1000),
      new Date(endTime * 1000),
    ]);
    const klineData = result.rows.map((row) => ({
      bucket: row.bucket, // Time bucket (e.g., start of the week)
      open: row.open, // Opening price
      high: row.high,
      low: row.low,
      close: row.close,
      volume: row.volume,
    }));
    res.status(200).send(klineData);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = klineRouter;
