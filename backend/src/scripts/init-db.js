import "dotenv/config";
import mongoose from "mongoose";
import { Box, Pokemon } from "../data/schema.js";
import axios from "axios";

// Read values from environment variables
const numBoxes = parseInt(process.env.NUM_BOXES) || 5;
const numSlots = parseInt(process.env.NUM_SLOTS) || 30;
const numSpecies = parseInt(process.env.NUM_SPECIES) || 898;

await mongoose.connect(process.env.DB_URL);
console.log("Connected to the database.");

// Clear data
await Pokemon.deleteMany({});
await Box.deleteMany({});
console.log("Cleared existing data.");

// Create NUM_BOXES boxes
const boxes = [];
for (let i = 1; i <= numBoxes; i++) {
  const box = new Box({ boxNumber: i });
  await box.save();
  boxes.push(box);
  console.log(`Created box ${i}.`);
}

// For each box...
for (const box of boxes) {
  // For each of the box's NUM_SLOTS slots...
  let count = 0;
  for (let slotNumber = 1; slotNumber <= numSlots; slotNumber++) {
    // With a 30% chance, create a Pokémon in that slot
    if (Math.random() < 0.3) {
      const pokemon = await createPokemon();
      box.pokemon[slotNumber - 1] = pokemon?._id;
      count++;
      console.log(
        `Added a ${pokemon.isShiny ? "✨✨SHINY✨✨ " : ""}${pokemon.name} to box ${box.boxNumber}, slot ${slotNumber}.`
      );
    }

    // Otherwise, leave the slot empty
    else {
      box.pokemon[slotNumber - 1] = null;
    }
  }
  await box.save();
  console.log(`Updated box #${box.boxNumber} with ${count} Pokémon.`);
}

await mongoose.disconnect();
console.log("Disconnected from the database.");

async function createPokemon() {
  // 5% chance to be shiny
  const isShiny = Math.random() < 0.05;
  // Random species number from 1 to NUM_SPECIES
  try {
    const pokeApiData = await fetchDataFromPokeAPI(Math.floor(Math.random() * numSpecies) + 1);

    const pokemon = new Pokemon({
      ...pokeApiData,
      isShiny
    });
    await pokemon.save();
    return pokemon;
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    return null;
  }
}

async function fetchDataFromPokeAPI(speciesNum) {
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${speciesNum}`);
  const data = response.data;
  return {
    dexNum: data.id,
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    normalImageUrl: data.sprites.other.home.front_default,
    shinyImageUrl: data.sprites.other.home.front_shiny
  };
}
