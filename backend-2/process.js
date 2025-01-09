import { pool } from "pg"; // Assuming your PostgreSQL pool is exported from 'db.js'

async function processOrder(order) {
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
      DO UPDATE SET quantity = users_assets.quantity + $3;
    `;
    await client.query(updateAssetQuery, [
      order.user_id,
      assetId,
      order.filled,
    ]);

    // Step 3: Deduct funds from the user's account
    const updateFundsQuery = `
      UPDATE users 
      SET funds = funds - $1
      WHERE user_id = $2 AND funds >= $1;
    `;
    const totalCost = order.price * order.filled;
    const { rowCount: fundsUpdated } = await client.query(updateFundsQuery, [
      totalCost,
      order.user_id,
    ]);

    if (fundsUpdated === 0) {
      throw new Error("Insufficient funds to process the order.");
    }

    // Commit transaction
    await client.query("COMMIT");
    console.log("Order processed successfully");
  } catch (error) {
    // Rollback transaction in case of an error
    await client.query("ROLLBACK");
    console.error("Failed to process order:", error.message);
  } finally {
    // Release the client back to the pool
    client.release();
  }
}

module.exports = processOrder;
