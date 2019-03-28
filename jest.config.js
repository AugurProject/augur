module.exports = {
  reporters: ["default", "jest-junit"],
  projects: [
    "<rootDir>/packages/augur-state",
    // "<rootDir>/packages/augur-ui",
    "<rootDir>/packages/augur-test",
  ],
};
