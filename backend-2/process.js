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

// Function to ensure tables exist
async function ensureTablesExist(client) {
  try {
    // Check if assets table exists
    const assetsTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'assets'
      );
    `;
    const assetsTableExists = await client.query(assetsTableQuery);

    if (!assetsTableExists.rows[0].exists) {
      console.log("Creating assets table...");
      await client.query(`
        CREATE TABLE assets (
          asset_id SERIAL PRIMARY KEY,
          asset_name VARCHAR(50) UNIQUE NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }

    // Check if users table exists
    const usersTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `;
    const usersTableExists = await client.query(usersTableQuery);

    if (!usersTableExists.rows[0].exists) {
      console.log("Creating users table...");
      await client.query(`
        CREATE TABLE users (
          user_id VARCHAR(255) PRIMARY KEY,
          username VARCHAR(50) UNIQUE,
          funds DOUBLE PRECISION DEFAULT 100000,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }

    // Check if users_assets table exists
    const usersAssetsTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users_assets'
      );
    `;
    const usersAssetsTableExists = await client.query(usersAssetsTableQuery);

    if (!usersAssetsTableExists.rows[0].exists) {
      console.log("Creating users_assets table...");
      await client.query(`
        CREATE TABLE users_assets (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) REFERENCES users(user_id),
          asset_id INTEGER REFERENCES assets(asset_id),
          quantity DOUBLE PRECISION DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, asset_id)
        );
      `);
    }

    console.log("All required tables exist or have been created.");
  } catch (error) {
    console.error("Error ensuring tables exist:", error);
    throw error;
  }
}

export async function processOrder(order) {
  const client = await pool.connect();
  console.log("orders reached for processing", order);

  try {
    // Start transaction
    await client.query("BEGIN");

    // Ensure all required tables exist
    await ensureTablesExist(client);

    // Check if the order type is valid
    if (!order.side || (order.side !== "buy" && order.side !== "sell")) {
      throw new Error("Invalid order type. Must be 'buy' or 'sell'.");
    }

    // Step 1: Find the asset_id using order.market
    const { rows: assetRows } = await client.query(
      "SELECT asset_id FROM assets WHERE asset_name = $1",
      [order.market]
    );

    if (assetRows.length === 0) {
      // Asset doesn't exist, create it
      console.log(`Creating new asset: ${order.market}`);
      const insertAssetResult = await client.query(
        "INSERT INTO assets (asset_name) VALUES ($1) RETURNING asset_id",
        [order.market]
      );
      assetRows.push(insertAssetResult.rows[0]);
    }

    const assetId = assetRows[0].asset_id;

    // Step 2: Check if user exists
    const { rows: userRows } = await client.query(
      "SELECT user_id FROM users WHERE user_id = $1",
      [order.user_id]
    );

    if (userRows.length === 0) {
      // User doesn't exist, create it with default funds
      console.log(`Creating new user: ${order.user_id}`);
      await client.query("INSERT INTO users (user_id, funds) VALUES ($1, $2)", [
        order.user_id,
        1000000,
      ]);
    }

    // Step 3: Process the order based on type
    const totalValue = order.price * parseFloat(order.fills);

    if (order.side === "buy") {
      // Buying: Update user_assets and deduct funds

      // Update assets
      const updateAssetQuery = `
        INSERT INTO users_assets (user_id, asset_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, asset_id)
        DO UPDATE SET 
          quantity = users_assets.quantity + EXCLUDED.quantity,
          updated_at = CURRENT_TIMESTAMP
        RETURNING quantity;
      `;

      const assetResult = await client.query(updateAssetQuery, [
        order.user_id,
        assetId,
        order.filled,
      ]);

      // Deduct funds from user account
      const updateFundsQuery = `
        UPDATE users 
        SET funds = funds - $1
        WHERE user_id = $2 AND funds >= $1
        RETURNING funds;
      `;

      const { rows: fundsRows } = await client.query(updateFundsQuery, [
        totalValue,
        order.user_id,
      ]);

      if (fundsRows.length === 0) {
        throw new Error("Insufficient funds to process the buy order.");
      }

      // Commit transaction
      await client.query("COMMIT");

      console.log("Buy order processed successfully", {
        newBalance: fundsRows[0].funds,
        newQuantity: assetResult.rows[0].quantity,
      });

      return {
        success: true,
        orderType: "buy",
        newBalance: fundsRows[0].funds,
        newQuantity: assetResult.rows[0].quantity,
      };
    } else if (order.side === "sell") {
      await client.query("BEGIN");

      // Check user assets
      const { rows: userAssetRows } = await client.query(
        "SELECT quantity FROM users_assets WHERE user_id = $1 AND asset_id = $2",
        [order.user_id, assetId]
      );

      let userQuantity = userAssetRows.length ? userAssetRows[0].quantity : 0;

      // If the user doesn’t have enough assets, add the missing amount
      if (userQuantity < order.filled) {
        const missingAssets = order.filled - userQuantity;
        console.log(
          `User has only ${userQuantity}, adding ${missingAssets} assets`
        );

        await client.query(
          `INSERT INTO users_assets (user_id, asset_id, quantity, updated_at) 
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
         ON CONFLICT (user_id, asset_id) 
         DO UPDATE SET quantity = users_assets.quantity + EXCLUDED.quantity, updated_at = CURRENT_TIMESTAMP`,
          [order.user_id, assetId, missingAssets]
        );

        userQuantity = order.filled; // Ensure user has enough assets
      }

      // Update assets (subtract sold quantity)
      const updateAssetQuery = `
      UPDATE users_assets
      SET quantity = quantity - $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2 AND asset_id = $3
      RETURNING quantity;
    `;

      const assetResult = await client.query(updateAssetQuery, [
        order.filled,
        order.user_id,
        assetId,
      ]);

      // Ensure assetResult is not empty
      const newQuantity =
        assetResult.rows.length > 0 ? assetResult.rows[0].quantity : 0;

      // Add funds to user account
      const updateFundsQuery = `
      UPDATE users 
      SET funds = funds + $1
      WHERE user_id = $2
      RETURNING funds;
    `;

      const { rows: fundsRows } = await client.query(updateFundsQuery, [
        totalValue,
        order.user_id,
      ]);

      // Commit transaction
      await client.query("COMMIT");

      console.log("Sell order processed successfully", {
        newBalance: fundsRows[0].funds,
        newQuantity,
      });

      return {
        success: true,
        orderType: "sell",
        newBalance: fundsRows[0].funds,
        newQuantity,
      };
    }
  } catch (error) {
    // Rollback transaction in case of an error
    await client.query("ROLLBACK");
    console.error("Failed to process order:", error.message);

    return {
      success: false,
      error: error.message,
    };
  } finally {
    client && client.release();
  }
}

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
