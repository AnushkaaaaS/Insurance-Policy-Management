/** @type {import('jest').Config} */

module.exports = {
  preset: "ts-jest",

  testEnvironment: "node",

  roots: ["<rootDir>/tests"],

  testMatch: ["**/*.test.ts"],

  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

  // All test files share ONE real MongoDB database (Atlas), and setup.ts
  // wipes every collection after each test. Running suites in parallel
  // workers means File A's cleanup can wipe data File B is mid-test with —
  // hence the duplicate-key/missing-cookie/wrong-count failures you saw
  // under `jest --coverage` (which defaults to parallel workers) but not
  // under `jest --runInBand`. Locking this here means it's safe no matter
  // which npm script or flags someone runs.
  maxWorkers: 1,

  moduleFileExtensions: [
    "ts",
    "js",
    "json",
  ],

  clearMocks: true,

  testTimeout: 30000,

  collectCoverage: true,

  coverageDirectory: "coverage",

  collectCoverageFrom: [
    "src/controllers/**/*.ts",
    "src/middlewares/**/*.ts",
    "src/routes/**/*.ts",
  ],
};