import express from "express";
const router = express.Router();

import boxesRoutes from "./api-boxes.js";
router.use("/boxes", boxesRoutes);

export default router;