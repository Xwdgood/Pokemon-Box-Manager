import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Pokemon Schema
const pokemonSchema = new Schema({
  dexNum: {
    type: Number
  },
  name: {
    type: String,
    required: true
  },
  isShiny: {
    type: Boolean
  },
  normalImageUrl: {
    type: String
  },
  shinyImageUrl: {
    type: String
  }
});

// Box Schema
const boxSchema = new Schema({
  boxNumber: {
    type: Number,
    required: true,
    unique: true
  },
  pokemon: [{
    type: Schema.Types.ObjectId,
    ref: 'Pokemon'
  }]
});

// Create and export models
export const Pokemon = mongoose.model('Pokemon', pokemonSchema);
export const Box = mongoose.model('Box', boxSchema);
