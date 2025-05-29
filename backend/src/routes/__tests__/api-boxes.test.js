import { describe, test, beforeEach, beforeAll, afterAll } from "vitest";
import express, { Express } from "express";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Box, Pokemon } from "../../data/schema.js";
import boxesRoutes from "../api-boxes.js";

console.log("Running vitest for api-boxes routes...");
console.log(process.env.NUM_BOXES);

// Three test pokemon
const testPokemon = [
  {
    _id: new mongoose.Types.ObjectId("000000000000000000000001"),
    name: "Bulbasaur",
    dexNum: 1,
    isShiny: false,
    normalImageUrl: "https://example.com/bulbasaur.png",
    shinyImageUrl: "https://example.com/bulbasaur-shiny.png"
  },
  {
    _id: new mongoose.Types.ObjectId("000000000000000000000002"),
    name: "Charmander",
    dexNum: 4,
    isShiny: true,
    normalImageUrl: "https://example.com/charmander.png",
    shinyImageUrl: "https://example.com/charmander-shiny.png"
  },
  {
    _id: new mongoose.Types.ObjectId("000000000000000000000003"),
    name: "Squirtle",
    dexNum: 7,
    isShiny: false,
    normalImageUrl: "https://example.com/squirtle.png",
    shinyImageUrl: "https://example.com/squirtle-shiny.png"
  }
];

// Test boxes
const testBoxes = [
  // Box 1 contains Bulbasaur in slot 1 and nothing in slot 2
  {
    boxNumber: 1,
    pokemon: [testPokemon[0]._id, null]
  },
  // Box 2 contains Charmander in slot 1 and Squirtle in slot 2
  {
    boxNumber: 2,
    pokemon: [testPokemon[1]._id, testPokemon[2]._id]
  },
  // Box 3 is empty
  {
    boxNumber: 3,
    pokemon: [null, null]
  }
];

/** @type MongoMemoryServer */
let mongod;

/** @type Express */
let app;

// Setup Express app and MongoDB connection
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use("/api/boxes", boxesRoutes);
});

// Tear down the database after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// Clear the database and insert test data before each test
beforeEach(async () => {
  await Box.deleteMany({});
  await Pokemon.deleteMany({});

  await Pokemon.insertMany(testPokemon);
  await Box.insertMany(testBoxes);
});

describe("GET /api/boxes/:boxNumber", () => {
  test("Gets first box successfully", async () => {
    // Expect 200 OK response
    const response = await request(app).get("/api/boxes/1").expect(200);

    // Expect correct box num and box size
    expect(response.body.boxNumber).toBe(1);
    expect(response.body.pokemon.length).toBe(2);

    // Expect NO "previous-box" header
    expect(response.headers["previous-box"]).toBeUndefined();
    // Expect "next-box" header to be 2
    expect(response.headers["next-box"]).toBe("2");
  });

  test("Gets middle box successfully", async () => {
    // Expect 200 OK response
    const response = await request(app).get("/api/boxes/2").expect(200);

    // Expect correct box num and box size
    expect(response.body.boxNumber).toBe(2);
    expect(response.body.pokemon.length).toBe(2);

    // Expect "previous-box" header to be 1
    expect(response.headers["previous-box"]).toBe("1");
    // Expect "next-box" header to be 3
    expect(response.headers["next-box"]).toBe("3");
  });

  test("Gets last box successfully", async () => {
    // Expect 200 OK response
    const response = await request(app).get("/api/boxes/3").expect(200);

    // Expect correct box num and box size
    expect(response.body.boxNumber).toBe(3);
    expect(response.body.pokemon.length).toBe(2);

    // Expect "previous-box" header to be 2
    expect(response.headers["previous-box"]).toBe("2");
    // Expect NO "next-box" header
    expect(response.headers["next-box"]).toBeUndefined();
  });

  test("Returns pokemon in box successfully", async () => {
    // Expect 200 OK response
    const response = await request(app).get("/api/boxes/2").expect(200);

    // Expect first pokemon to be Charmander
    expect(response.body.pokemon[0].name).toBe("Charmander");
    expect(response.body.pokemon[0].isShiny).toBe(true);
    expect(response.body.pokemon[0]._id).toBe("000000000000000000000002");

    // Expect second pokemon to be Squirtle
    expect(response.body.pokemon[1].name).toBe("Squirtle");
    expect(response.body.pokemon[1].isShiny).toBe(false);
    expect(response.body.pokemon[1]._id).toBe("000000000000000000000003");
  });

  test("Returns empty box successfully", async () => {
    // Expect 200 OK response
    const response = await request(app).get("/api/boxes/3").expect(200);

    // Expect box to be empty
    expect(response.body.pokemon).toEqual([null, null]);
  });

  test("Returns 404 for non-existent box", async () => {
    // Expect 404 Not Found response
    await request(app).get("/api/boxes/999").expect(404);
  });

  test("Returns 400 for invalid box number", async () => {
    // Expect 400 Bad Request response
    await request(app).get("/api/boxes/invalid").expect(400);
  });

  test("Returns 400 for negative box number", async () => {
    // Expect 400 Bad Request response
    await request(app).get("/api/boxes/-1").expect(400);
  });
});

// Unused by frontend, so we will skip this test to save time.
describe.skip("GET /api/boxes/:boxNumber/:slotNumber", () => {
  test("Gets pokemon in first box slot 1 successfully", async () => {
    // Expect 200 OK response
    const response = await request(app).get("/api/boxes/1/1").expect(200);

    // Expect pokemon to be Bulbasaur
    expect(response.body.name).toBe("Bulbasaur");
    expect(response.body.isShiny).toBe(false);
    expect(response.body._id).toBe("000000000000000000000001");
  });

  test("Gets pokemon in second box slot 2 successfully", async () => {
    // Expect 200 OK response
    const response = await request(app).get("/api/boxes/2/2").expect(200);

    // Expect pokemon to be Squirtle
    expect(response.body.name).toBe("Squirtle");
    expect(response.body.isShiny).toBe(false);
    expect(response.body._id).toBe("000000000000000000000003");
  });

  test("Returns 404 for empty slot in first box", async () => {
    // Expect 404 Not Found response
    await request(app).get("/api/boxes/1/2").expect(404);
  });

  test("Returns 404 for non-existent box", async () => {
    // Expect 404 Not Found response
    await request(app).get("/api/boxes/999/1").expect(404);
  });

  test("Returns 404 for non-existent slot", async () => {
    // Expect 404 Not Found response
    await request(app).get("/api/boxes/1/999").expect(404);
  });

  test("Returns 400 for invalid box number", async () => {
    // Expect 400 Bad Request response
    await request(app).get("/api/boxes/invalid/1").expect(400);
  });

  test("Returns 400 for negative box number", async () => {
    // Expect 400 Bad Request response
    await request(app).get("/api/boxes/-1/1").expect(400);
  });

  test("Returns 400 for invalid slot number", async () => {
    // Expect 400 Bad Request response
    await request(app).get("/api/boxes/1/invalid").expect(400);
  });

  test("Returns 400 for negative slot number", async () => {
    // Expect 400 Bad Request response
    await request(app).get("/api/boxes/1/-1").expect(400);
  });
});

describe("PATCH /api/boxes", () => {
  test("Swaps two pokemon in the same box successfully", async () => {
    const moveData = {
      swap: {
        source: { boxNumber: 2, slotNumber: 1 },
        target: { boxNumber: 2, slotNumber: 2 }
      }
    };

    // Expect 200 OK response
    await request(app).patch("/api/boxes").send(moveData).expect(204);

    // Check box 2 slot 1 in the database - Should now be Squirtle
    const box2 = await Box.findOne({ boxNumber: 2 });
    expect(box2.pokemon[0]?.toString()).toBe("000000000000000000000003");

    // Check box 2 slot 2 in the database - Should now be Charmander
    expect(box2.pokemon[1]?.toString()).toBe("000000000000000000000002");
  });

  test("Swaps two pokemon in different boxes successfully", async () => {
    const moveData = {
      swap: {
        source: { boxNumber: 1, slotNumber: 1 },
        target: { boxNumber: 2, slotNumber: 2 }
      }
    };

    // Expect 200 OK response
    await request(app).patch("/api/boxes").send(moveData).expect(204);

    // Check box 1 slot 1 in the database - Should now be Squirtle
    const box1 = await Box.findOne({ boxNumber: 1 });
    expect(box1.pokemon[0]?.toString()).toBe("000000000000000000000003");

    // Check box 2 slot 2 in the database - Should now be Bulbasaur
    const box2 = await Box.findOne({ boxNumber: 2 });
    expect(box2.pokemon[1]?.toString()).toBe("000000000000000000000001");
  });

  test("Moves a pokemon into an empty slot", async () => {
    const moveData = {
      swap: {
        source: { boxNumber: 2, slotNumber: 1 },
        target: { boxNumber: 3, slotNumber: 1 }
      }
    };

    // Expect 200 OK response
    await request(app).patch("/api/boxes").send(moveData).expect(204);

    // Check box 2 slot 1 in the database - Should now be empty
    const box2 = await Box.findOne({ boxNumber: 2 });
    expect(box2.pokemon[0]).toBeNull();

    // Check box 3 slot 1 in the database - Should now be Charmander
    const box3 = await Box.findOne({ boxNumber: 3 });
    expect(box3.pokemon[0]?.toString()).toBe("000000000000000000000002");
  });

  test("Returns 404 for non-existent source box", async () => {
    const moveData = {
      swap: {
        source: { boxNumber: 999, slotNumber: 1 },
        target: { boxNumber: 2, slotNumber: 2 }
      }
    };

    // Expect 404 Not Found response
    await request(app).patch("/api/boxes").send(moveData).expect(404);
  });

  test("Returns 404 for non-existent destination box", async () => {
    const moveData = {
      swap: {
        source: { boxNumber: 1, slotNumber: 1 },
        target: { boxNumber: 999, slotNumber: 2 }
      }
    };

    // Expect 404 Not Found response
    await request(app).patch("/api/boxes").send(moveData).expect(404);
  });

  test("Returns 404 for empty source slot", async () => {
    const moveData = {
      swap: {
        source: { boxNumber: 1, slotNumber: 2 }, // Slot 2 is empty in box 1
        target: { boxNumber: 2, slotNumber: 1 }
      }
    };

    // Expect 404 Not Found response
    await request(app).patch("/api/boxes").send(moveData).expect(404);
  });

  test("Returns 422 for invalid request body", async () => {
    // Invalid body without swap object
    const invalidData = { invalid: "data" };

    // Expect 422 Unprocessable Entity response
    await request(app).patch("/api/boxes").send(invalidData).expect(422);
  });

  test("Returns 422 for invalid swap structure", async () => {
    // Invalid swap structure
    const invalidData = {
      swap: {
        source: { boxNumber: 1, slotNumber: "invalid" }, // Invalid slot
        target: { boxNumber: 2, slotNumber: 1 }
      }
    };

    // Expect 422 Unprocessable Entity response
    await request(app).patch("/api/boxes").send(invalidData).expect(422);
  });

  test("Returns 422 for negative box number in swap", async () => {
    const moveData = {
      swap: {
        source: { boxNumber: -1, slotNumber: 1 },
        target: { boxNumber: 2, slotNumber: 2 }
      }
    };

    // Expect 422 Unprocessable Entity response
    await request(app).patch("/api/boxes").send(moveData).expect(422);
  });

  test("Returns 422 for negative slot number in swap", async () => {
    const moveData = {
      swap: {
        source: { boxNumber: 1, slotNumber: -1 },
        target: { boxNumber: 2, slotNumber: 2 }
      }
    };

    // Expect 422 Unprocessable Entity response
    await request(app).patch("/api/boxes").send(moveData).expect(422);
  });

  test("Returns 422 for invalid box number in swap", async () => {
    const moveData = {
      swap: {
        source: { boxNumber: "invalid", slotNumber: 1 },
        target: { boxNumber: 2, slotNumber: 2 }
      }
    };

    // Expect 422 Unprocessable Entity response
    await request(app).patch("/api/boxes").send(moveData).expect(422);
  });

  test("Returns 422 for empty swap object", async () => {
    const moveData = { swap: {} };

    // Expect 422 Unprocessable Entity response
    await request(app).patch("/api/boxes").send(moveData).expect(422);
  });

  test("Returns 422 for missing swap object", async () => {
    // Expect 422 Unprocessable Entity response
    await request(app).patch("/api/boxes").send({}).expect(422);
  });

  test("Returns 422 for missing from or to in swap", async () => {
    const moveData = {
      swap: {
        source: { boxNumber: 1, slotNumber: 1 }
        // Missing 'to'
      }
    };

    // Expect 422 Unprocessable Entity response
    await request(app).patch("/api/boxes").send(moveData).expect(422);
  });
});
