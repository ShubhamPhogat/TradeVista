import { createClient } from "redis";
import { Engine } from "./trade/engine";

async function main() {
  const redisClient = createClient();
  await redisClient.connect();
  console.log("connected to redis");

  while (true) {
    const req = await redisClient.rPop(messages);
    if (!req) {
    } else {
      const response = JSON.parse(req);
      const engine = new Engine(response);
      engine.process(response);
    }
  }
}

main();
