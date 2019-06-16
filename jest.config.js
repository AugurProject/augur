module.exports = {
  projects: [
    "<rootDir>/packages/augur-sdk",
    "<rootDir>/packages/augur-ui",
    "<rootDir>/packages/augur-test",
  ],
  reporters: ["default"],
  globalSetup: "./packages/augur-test/setup.js",
};
