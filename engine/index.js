// code to run express server

import express from "express";
import getSubscriptions from "./publisher";
const app = express();
const port = 5001;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

getSubscriptions();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
