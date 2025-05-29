import dotenv from "dotenv";
import { resolve } from "path";
import { vi } from "vitest";

// Load environment variables from .env.test file
dotenv.config({ path: resolve(__dirname, ".env.test") });

global.jest = vi;
