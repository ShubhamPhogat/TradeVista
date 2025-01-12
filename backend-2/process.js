import pkg from "pg";
const { Pool } = pkg;

// Create a connection pool
export const pool = new Pool({
  user: "myuser",
  host: "localhost",
  password: "1234567VISTA",
  port: 5432,
  // Add some connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Add error handler to the pool
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export async function processOrder(order) {
  const client = await pool.connect();

  try {
    // Start transaction
    await client.query("BEGIN");

    // Step 1: Find the asset_id using order.market
    const { rows: assetRows } = await client.query(
      "SELECT asset_id FROM assets WHERE asset_name = $1",
      [order.market]
    );

    if (assetRows.length === 0) {
      throw new Error(`Market ${order.market} does not exist.`);
    }

    const assetId = assetRows[0].asset_id;

    // Step 2: Update the user's asset quantity
    const updateAssetQuery = `
      INSERT INTO users_assets (user_id, asset_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, asset_id)
      DO UPDATE SET quantity = users_assets.quantity + EXCLUDED.quantity
      RETURNING quantity;
    `;

    const assetResult = await client.query(updateAssetQuery, [
      order.user_id,
      assetId,
      order.filled,
    ]);

    // Step 3: Deduct funds from the user's account
    const updateFundsQuery = `
      UPDATE users 
      SET funds = funds - $1
      WHERE user_id = $2 AND funds >= $1
      RETURNING funds;
    `;

    const totalCost = order.price * order.filled;
    const { rows: fundsRows } = await client.query(updateFundsQuery, [
      totalCost,
      order.user_id,
    ]);

    if (fundsRows.length === 0) {
      throw new Error("Insufficient funds to process the order.");
    }

    // Commit transaction
    await client.query("COMMIT");

    console.log("Order processed successfully", {
      newBalance: fundsRows[0].funds,
      newQuantity: assetResult.rows[0].quantity,
    });

    return {
      success: true,
      newBalance: fundsRows[0].funds,
      newQuantity: assetResult.rows[0].quantity,
    };
  } catch (error) {
    // Rollback transaction in case of an error
    await client.query("ROLLBACK");
    console.error("Failed to process order:", error.message);

    return {
      success: false,
      error: error.message,
    };
  } finally {
    // Release the client back to the pool
    client && client.release();
  }
}

// Handle process termination
process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Closing pool...");
  await pool.end();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Received SIGINT. Closing pool...");
  await pool.end();
  process.exit(0);
});
