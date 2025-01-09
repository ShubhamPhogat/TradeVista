import { createClient } from "redis";
import { Engine } from "./trade/engine.js";

async function main() {
  const redisClient = createClient();
  await redisClient.connect();
  console.log("connected to redis");

  while (true) {
    const req = await redisClient.rPop("message");
    if (!req) {
    } else {
      console.log(`Received message: ${req}`);
      const response = JSON.parse(req);
      const engine = new Engine(response.message.data);
      engine.process(response.order_id, response.message);
    }
  }
}

main();
