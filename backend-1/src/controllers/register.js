const { v4 } = require("uuid");
const pkg = require("pg");
const { Client } = require("pg");
const client = new Client({
  user: "myuser",
  host: "localhost",
  password: "1234567VISTA",
  port: 5432,
});
client.connect();

async function registerUser(req, res) {
  const { userName, funds } = req.body();
  if (!userName || !funds) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const userId = v4();
}

module.exports = registerUser;
