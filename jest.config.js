module.exports = {
  projects: [
    '<rootDir>/packages/augur-sdk',
    '<rootDir>/packages/augur-ui',
    '<rootDir>/packages/augur-utils',
    '<rootDir>/packages/augur-test',
    '<rootDir>/packages/ethersjs-provider',
  ],
  reporters: ['default'],
  globalSetup: './packages/augur-test/setup.js',
};
