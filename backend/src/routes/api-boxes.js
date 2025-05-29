import express from "express";
import { Box } from "../data/schema.js";

// You may use this value in your routes to determine the max number of boxes,
// so that you can return the next and previous box numbers in the response headers.
const numBoxes = parseInt(process.env.NUM_BOXES) || 5;

const router = express.Router();

// Handler for GET /:boxNumber
router.get("/:boxNumber", async (req, res) => {
  const { boxNumber } = req.params;
  
  // Validate boxNumber
  const boxNum = parseInt(boxNumber);
  if (isNaN(boxNum) || boxNum < 1) {
    return res.status(400).json({ error: "Invalid box number" });
  }
  
  try {
    // Find the box and populate pokemon data
    const box = await Box.findOne({ boxNumber: boxNum }).populate({
      path: "pokemon",
      retainNullValues: true,
    });
    
    // Check if box exists
    if (!box) {
      return res.status(404).json({ error: "Box not found" });
    }
    
    // Set custom headers
    if (boxNum > 1) {
      res.set("previous-box", (boxNum - 1).toString());
    }
    if (boxNum < numBoxes) {
      res.set("next-box", (boxNum + 1).toString());
    }
    
    // Return the box with populated pokemon
    res.json(box);
    
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Handler for PATCH /
router.patch("/", async (req, res) => {
  try {
    // Validate request body structure
    const { swap } = req.body;
    
    if (!swap || typeof swap !== 'object') {
      return res.status(422).json({ error: "Data format error" });
    }
    
    const { source, target } = swap;
    
    if (!source || !target || typeof source !== 'object' || typeof target !== 'object') {
      return res.status(422).json({ error: "Data format error" });
    }
    
    const { boxNumber: sourceBoxNum, slotNumber: sourceSlotNum } = source;
    const { boxNumber: targetBoxNum, slotNumber: targetSlotNum } = target;
    
    // Validate all numbers
    if (!Number.isInteger(sourceBoxNum) || !Number.isInteger(targetBoxNum) ||
        !Number.isInteger(sourceSlotNum) || !Number.isInteger(targetSlotNum) ||
        sourceBoxNum < 1 || targetBoxNum < 1 || sourceSlotNum < 1 || targetSlotNum < 1) {
      return res.status(422).json({ error: "Data format error" });
    }
    
    // Find both boxes
    const sourceBox = await Box.findOne({ boxNumber: sourceBoxNum });
    const targetBox = await Box.findOne({ boxNumber: targetBoxNum });
    
    if (!sourceBox || !targetBox) {
      return res.status(404).json({ error: "Source or destination box not found" });
    }
    
    // Check if source slot has a pokemon (slotNumber is 1-indexed, array is 0-indexed)
    const sourceIndex = sourceSlotNum - 1;
    const targetIndex = targetSlotNum - 1;
    
    if (!sourceBox.pokemon[sourceIndex]) {
      return res.status(404).json({ error: "No pokemon in source slot" });
    }
    
    // Perform the swap
    const sourcePokemon = sourceBox.pokemon[sourceIndex];
    const targetPokemon = targetBox.pokemon[targetIndex];
    
    // If swapping within the same box, we need to be careful
    if (sourceBox._id.toString() === targetBox._id.toString()) {
      // Create a new array to ensure Mongoose detects the change
      const newPokemonArray = [...sourceBox.pokemon];
      newPokemonArray[sourceIndex] = targetPokemon;
      newPokemonArray[targetIndex] = sourcePokemon;
      sourceBox.pokemon = newPokemonArray;
    } else {
      // Different boxes, swap normally
      sourceBox.pokemon[sourceIndex] = targetPokemon;
      targetBox.pokemon[targetIndex] = sourcePokemon;
      targetBox.markModified('pokemon');
    }
    
    // Mark the pokemon array as modified to ensure Mongoose saves the changes
    sourceBox.markModified('pokemon');
    
    // Save both boxes
    await sourceBox.save();
    if (sourceBox._id.toString() !== targetBox._id.toString()) {
      await targetBox.save();
    }
    
    // Return 204 No Content for successful swap
    res.status(204).send();
    
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
