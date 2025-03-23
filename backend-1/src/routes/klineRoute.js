const express = require("express");
const klineRouter = express.Router();
const { Client } = require("pg");
const redisManager = require("../redisManager");
const client = new Client({
  user: "myuser",
  host: "localhost",
  password: "1234567VISTA",
  port: 5432,
});
client.connect();

klineRouter.post("/", async (req, res) => {
  const { market, interval } = req.body;
  const currentTime = new Date();

  const startTime = new Date(Math.floor(currentTime.getTime() / 60000) * 60000);

  const endTime = new Date(startTime.getTime() + 60000);
  let query = null;
  switch (interval) {
    case "1m":
      query = `SELECT * FROM klines_1m_btc WHERE bucket >= $1 AND bucket <= $2`;

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
      new Date(startTime),
      new Date(endTime),
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

klineRouter.post("/depth", async (req, res) => {
  const { market } = req.body;
  if (!market || market === "") {
    return res.status(400).send({ message: "Market is required" });
  }
  const rm = await redisManager.getInstance();
  const response = await rm.createAndWait({
    type: "GET_DEPTH",
    data: {
      market,
    },
  });
  res.json(response);
});

module.exports = klineRouter;
