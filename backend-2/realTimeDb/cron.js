import pkg from "pg";
const { Pool } = pkg;

// Maintain a single client for refreshing views
let refreshClient = null;
let refreshInterval = null;

/**
 * Initialize view refresh cron job using the existing connection pool
 * @param {Pool} pool - PostgreSQL connection pool
 */
export const initRefreshViews = async (pool) => {
  try {
    // If we already have a refresh interval running, clear it
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }

    // If we already have a client, release it
    if (refreshClient) {
      refreshClient.release();
    }

    // Get a dedicated client from the pool for view refreshing
    refreshClient = await pool.connect();
    console.log("View refresh client connected");

    // Set up the interval for refreshing views
    refreshInterval = setInterval(async () => {
      try {
        await refreshClient.query("REFRESH MATERIALIZED VIEW klines_1m_btc");
        // Uncomment when these views are created:
        // await refreshClient.query("REFRESH MATERIALIZED VIEW Klines_1h");
        // await refreshClient.query("REFRESH MATERIALIZED VIEW Klines_1d");
        console.log("Views refreshed at", new Date().toISOString());
      } catch (error) {
        console.error("Error refreshing views:", error);

        // If the error is related to connection, reconnect the client
        if (
          error.code === "57P01" ||
          error.code === "57P02" ||
          error.code === "57P03"
        ) {
          console.log("Reconnecting view refresh client...");
          try {
            refreshClient.release();
            refreshClient = await pool.connect();
          } catch (reconnectError) {
            console.error(
              "Failed to reconnect refresh client:",
              reconnectError
            );
          }
        }
      }
    }, 10000); // Every 10 seconds

    console.log("View refresh job initialized");
  } catch (error) {
    console.error("Error initializing view refresh:", error);
    throw error;
  }
};

// For backward compatibility, but will log a warning
export const refeshViews = () => {
  console.warn(
    "DEPRECATED: refeshViews() was called directly. Use initRefreshViews(pool) instead."
  );
  // This function doesn't do anything anymore to prevent connection errors
};
