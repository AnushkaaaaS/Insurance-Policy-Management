import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load .env.test if present (separate DB so tests never touch real data),
// otherwise fall back to the normal .env.
dotenv.config({ path: path.resolve(__dirname, "../.env.test") });
dotenv.config();

beforeAll(async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add a .env.test (or .env) with a MONGODB_URI pointing at a TEST database before running the suite."
    );
  }

  if (!process.env.JWT_SECRET) {
    // authController signs tokens with this; without it every login "succeeds"
    // but every authenticated request fails with 401 "Invalid or Expired Token".
    process.env.JWT_SECRET = "test-secret";
  }

  await mongoose.connect(process.env.MONGODB_URI);
});

// Wipe every collection after each test so tests never leak state into one
// another (this is what was missing before — every describe block created
// "admin@test.com" / "agent@test.com" and relied on running in isolation).
afterEach(async () => {
  const collections = mongoose.connection.collections;

  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({}))
  );
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});