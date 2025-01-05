import { WebSocketServer } from "ws";
import { userManager } from "./controllers/userManaget";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  userManager.getInstance().addUser(ws);
});
