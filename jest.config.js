module.exports = {
  projects: [
    "<rootDir>/packages/augur-sdk",
    "<rootDir>/packages/augur-ui",
  ],
  reporters: ["default", "jest-junit"],
  globalSetup: "./packages/augur-test/setup.js",
};
