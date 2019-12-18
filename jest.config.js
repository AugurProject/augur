module.exports = {
  projects: [
    "<rootDir>/packages/augur-sdk",
    "<rootDir>/packages/augur-ui",
    "<rootDir>/packages/augur-test",
    "<rootDir>/packages/augur-test/src/tests/ui",
  ],
  reporters: ["default"],
  globalSetup: "./packages/augur-test/setup.js",
};
