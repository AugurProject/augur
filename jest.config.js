module.exports = {
  projects: [
    "<rootDir>/packages/augur-sdk",
    "<rootDir>/packages/augur-ui",
    "<rootDir>/packages/augur-test",
  ],
  reporters: ["default", "jest-junit"],
  globalSetup: "./packages/augur-test/setup.js",
};
