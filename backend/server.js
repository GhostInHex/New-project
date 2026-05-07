import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";

dotenv.config();

// Render provides the PORT, usually 10000. Default to 4000 for local dev.
const port = process.env.PORT || 4000;

// Use a self-invoking function or .then() to avoid top-level await issues on some environments
connectDatabase()
  .then(() => {
    // CRITICAL: Listen on '0.0.0.0' so Render can route traffic to your app
    app.listen(port, '0.0.0.0', () => {
      console.log(`API listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });