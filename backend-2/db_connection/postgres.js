import pkg from "pg";
const { Pool } = pkg;

// Create a connection pool
export const pool = new Pool({
  user: "myuser", // Replace with your PostgreSQL username
  host: "localhost", // Docker container runs on localhost
  password: "1234567VISTA", // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

// Test the connection
// async function ConnectPostgres() {
//   try {
//     const client = await pool.connect();
//     console.log("Connected to PostgreSQL database");

//     // Example query
//     const res = await client.query("SELECT NOW() AS current_time");
//     console.log("Server time:", res.rows[0].current_time);

//     client.release(); // Release the client back to the pool
//   } catch (err) {
//     console.error("Error connecting to PostgreSQL:", err);
//   } finally {
//     pool.end(); // Close the connection pool
//   }
// }

// module.exports = ConnectPostgres;
