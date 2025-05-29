import express from "express";

// You may use this value in your routes to determine the max number of boxes,
// so that you can return the next and previous box numbers in the response headers.
const numBoxes = parseInt(process.env.NUM_BOXES) || 5;

const router = express.Router();

// TODO Handler for GET /:boxNumber

// TODO Handler for PATCH /

export default router;
