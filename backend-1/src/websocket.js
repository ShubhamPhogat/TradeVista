const WebSocket = require("ws");
const redis = require("./db_connections/redis");

const url = require("url");

const map = new Map();

const subscribeChannel = async (channel) => {
  await redis.subscribe(channel, (err, count) => {
    if (err) {
      console.error("Error subscribing:", err);
    } else {
      console.log(
        `Subscribed to ${channel}. Number of subscriptions: ${count}`
      );
    }
  });

  // Listening for messages on the channel
  redis.on("message", (channel, message) => {
    console.log(`Received message from channel "${channel}": ${message}`);
  });
};

async function initialiseWebSocket(port) {
  const wss = new WebSocket.Server({ port });
  let online_users = 0;

  try {
    wss.on("connection", (ws, req) => {
      const params = new URLSearchParams(url.parse(req.url).query);
      const userId = params.get("userId"); // Extract the user ID from the query string

      ws.userId = userId; // Assign the user ID to the connection
      console.log(`New connection from user: ${ws.userId}`);

      // Handle incoming messages
      ws.on("message", (msg) => {
        const data = msg.toString();
        const obj = JSON.parse(data);
        const symbol = obj.symbol;
        if (map.has(symbol)) {
          const arr = map.get(symbol);
          arr.push(ws.userId);
        } else {
          const arr = [ws.userId];
          map.set(symbol, arr);
          subscribeChannel("btcusd");
        }
        console.log("Message received:", data);
      });

      // Handle client disconnections
      ws.on("close", () => {
        --online_users;
        console.log("Client disconnected. Remaining users:", online_users);

        // Notify all remaining clients about the updated number of online users
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ online_users }));
          }
        });
      });
    });

    console.log(`WebSocket server is running on ws://localhost:${port}`);
  } catch (e) {
    console.error("WebSocket server encountered an error:", e);
  }
}

module.exports = initialiseWebSocket;
