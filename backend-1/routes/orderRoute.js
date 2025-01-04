const express = require("express");
const redisManager = require("../redisManager");

const orderRoute = express.Router();

orderRoute.post(async (req, res) => {
  const { market, side, quantity, user_id } = req.body;
  if (!market || !side || !quantity || !user_id) {
    return res.status(400).json({ message: "All fields are required" });
  }
  console.log(market, side, quantity, user_id);

  const response = await redisManager.getInstance().sendandwait({
    type: "CREATE_ORDER",
    data: {
      market,
      side,
      quantity,
      user_id,
    },
  });
  res.json(response);
});

module.exports = orderRoute;
