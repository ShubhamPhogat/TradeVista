const express = require("express");
const initialiseWebSocket = require("./websocket");
const ConnectPostgres = require("./db_connections/postgres.js");
const WebSockerPort = 8080;
const authRoute = require("./routes/authRoute.js");
const orderRoute = require("./routes/orderRoute.js");
const KlineRouter = require("./routes/klineRoute.js");
initialiseWebSocket(WebSockerPort);
// ConnectPostgres();

const app = express();
const ExpressPort = 3000;

// Middleware to parse JSON request bodies

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/Kline", KlineRouter);

app.listen(ExpressPort, () => {
  console.log(`Server is listening on port ${ExpressPort}`);
});
