const realAugur = require.requireActual("../augurjs.js");

const MockAugurJS = jest.genMockFromModule("augur.js");

console.log("IN MOCKAUGUR");

MockAugurJS.constants = realAugur.augur.constants;
MockAugurJS.mockConstants = {};
Object.defineProperty(MockAugurJS, "mockConstants", {
  set(cs) {
    MockAugurJS.constants = cs;
  }
});
MockAugurJS.resetConstants = () => {
  MockAugurJS.constants = realAugur.augur.constants;
};

MockAugurJS.trading = {
  calculateProfitLoss: () => ({
    realized: "-1",
    unrealized: "2"
  })
};

MockAugurJS.connect = () => {};
MockAugurJS.mockConnect = () => {};
Object.defineProperty(MockAugurJS, "mockConnect", {
  set(f) {
    MockAugurJS.connect = f;
  }
});

MockAugurJS.contracts = {};
MockAugurJS.mockContracts = {};
Object.defineProperty(MockAugurJS, "mockContracts", {
  set(o) {
    MockAugurJS.contracts = o;
  }
});

MockAugurJS.reporting = realAugur.augur.reporting;

MockAugurJS.augur = MockAugurJS;

module.exports = MockAugurJS;
