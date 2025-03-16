import { createClient } from "redis";
import { Engine } from "./trade/engine.js";

async function main() {
  const redisClient = createClient();
  await redisClient.connect();
  console.log("Connected to Redis");

  try {
    while (true) {
      const req = await redisClient.brPop("message", 0); // Block until a message is available
      console.log("Data from brPop:", req);

      if (!req) {
        console.log("No data received, continuing...");
        continue; // Keep the loop running even if no data is received
      }

      let { key, element } = req;

      // Destructure key and value

      // Process the message
      element = JSON.parse(element);
      // console.log("this is order id ", element.order_id);
      const engine = new Engine(element.message.data);
      engine.process(element.order_id, element.message);
    }
  } catch (error) {
    console.error("Error receiving message:", error);
  } finally {
    await redisClient.quit();
    console.log("Redis connection closed");
  }
}

main();
