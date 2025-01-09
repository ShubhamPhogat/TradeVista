const express = require("express");
const redisManager = require("../redisManager");

const orderRoute = express.Router();

orderRoute.post("/", async (req, res) => {
  const { market, side, quantity, user_id, price, quoteAsset, baseAsset } =
    req.body;
  if (!market || !side || !quantity || !user_id || !price || !quoteAsset) {
    return res.status(400).json({ message: "All fields are required" });
  }
  console.log(market, side, quantity, user_id, price, quoteAsset);
  const rm = await redisManager.getInstance();
  const response = await rm.createAndWait({
    type: "CREATE_ORDER",
    data: {
      market,
      side,
      quantity,
      user_id,
      price,
      quoteAsset,
      baseAsset,
    },
  });
  res.json(response);
});

module.exports = orderRoute;
