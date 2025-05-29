// Configure environment variables
import "dotenv/config";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Set's our port to the PORT environment variable, or 3000 by default if the env is not configured.
const PORT = process.env.PORT ?? 3000;

// Creates the express server
const app = express();

// CORS setup, allowing all origins and exposing custom headers.
app.use(
  cors({
    exposedHeaders: ["next-box", "previous-box"]
  })
);

app.use(express.json());

// Our routes
import apiRoutes from "./routes/api.js";
app.use("/api", apiRoutes);

await mongoose.connect(process.env.DB_URL);

// Start the server running.
app.listen(PORT, () => {
  console.log(`CS732 test backend listening on port ${PORT}`);
});
