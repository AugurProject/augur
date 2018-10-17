const realAugur = require.requireActual("../augurjs.js");

const MockAugurJS = jest.genMockFromModule("augur.js");

MockAugurJS.rpc = {
  block: { number: 10000, timestamp: 4886718345 },
  constants: realAugur.augur.rpc.constants,
  set mockEth(e) {
    MockAugurJS.rpc.eth = e;
  },
  eth: {},
  getCurrentBlock: () => ({ number: 10000, timestamp: 4886718345 }),
  clear: realAugur.augur.rpc.clear,
  getNetworkID: () => 4
};

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

MockAugurJS.api = {
  set mockController(c) {
    MockAugurJS.api.Controller = c;
  },
  Controller: {},
  Universe: {
    getParentUniverse: (args, callback) => {
      expect(args).toStrictEqual({
        tx: { to: "0xGENESIS" }
      });
      return callback(null, "0x0000000000000000000000000000000000000000");
    },
    getOpenInterestInAttoEth: (args, callback) => {
      callback(null, "1000000");
    }
  }
};

MockAugurJS.augurNode = {
  set mockGetSyncData(f) {
    MockAugurJS.augurNode.getSyncData = f;
  },
  getSyncData: () => {},

  submitRequest: (methodName, args, callback) => {
    expect(methodName).toEqual("getUniversesInfo");
    expect(args).toStrictEqual({
      universe: "0xGENESIS",
      account: "0xACCOUNT"
    });
    return callback(null, universesData);
  }
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
