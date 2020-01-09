module.exports = {
  projects: [
    "<rootDir>/packages/augur-sdk",
    "<rootDir>/packages/augur-ui",
    "<rootDir>/packages/augur-test",
    // disabled because smoke test is currently not runnable in CI
    // disabled here instead of just skipping because skipping doesn't skip beforeAll
    // "<rootDir>/packages/augur-test/src/tests/ui",
  ],
  reporters: ["default"],
  globalSetup: "./packages/augur-test/setup.js",
};
