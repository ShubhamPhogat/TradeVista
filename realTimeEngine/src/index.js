import { WebSocketServer } from "ws";
import { userManager } from "./controllers/userManaget.js";

const wss = new WebSocketServer({ port: 8081 });

wss.on("connection", (ws) => {
  userManager.getInstance().addUser(ws);
});
