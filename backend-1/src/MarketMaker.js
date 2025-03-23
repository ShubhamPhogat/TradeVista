const redisManager = require("./redisManager.js");

const marketMaker = () => {
  const marketUid = "aewlkf1r384102384y3hjr";
  let orders = [];
  setInterval(async () => {
    for (let i = 0; i < 2; i++) {
      const side = Math.random(0, 1);
      if (side > 0.5) {
        const price = Math.floor(Math.random() * 1000 + 1000);
        const quantity = Math.floor(Math.random() * 10 + 1);
        let order = {
          type: "CREATE_ORDER",
          data: {
            market: "BTC",
            side: "sell",
            quantity,
            user_id: marketUid,
            price,
            quoteAsset: "USD",
            baseAsset: "BTC",
          },
        };
        orders.push(order);
        console.log(orders);
      } else {
        const price = Math.floor(Math.random() * 800 + 800);
        const quantity = Math.floor(Math.random() * 10 + 1);
        let order = {
          type: "CREATE_ORDER",
          data: {
            market: "BTC",
            side: "buy",
            quantity,
            user_id: marketUid,
            price,
            quoteAsset: "USD",
            baseAsset: "BTC",
          },
        };
        orders.push(order);
      }
    }
    const rm = await redisManager.getInstance();
    orders.forEach(async (order) => {
      let res = await rm.createAndWait(order);
    });
  }, 5000);
};

module.exports = marketMaker;
