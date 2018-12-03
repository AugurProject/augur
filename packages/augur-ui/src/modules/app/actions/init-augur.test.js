import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import realStore from "src/store";

import { initAugur, connectAugur } from "modules/app/actions/init-augur";
import * as AugurJS from "src/services/augurjs";

jest.mock("modules/app/actions/update-env", () => ({
  updateEnv: () => ({
    type: "UPDATE_ENV"
  })
}));

jest.mock("modules/app/actions/update-connection", () => ({
  updateConnectionStatus: () => ({
    type: "UPDATE_CONNECTION_STATUS"
  }),
  updateAugurNodeConnectionStatus: () => ({
    type: "UPDATE_AUGUR_NODE_CONNECTION_STATUS"
  })
}));

jest.mock("modules/contracts/actions/update-contract-addresses", () => ({
  updateContractAddresses: () => ({
    type: "UPDATE_CONTRACT_ADDRESSES"
  })
}));

jest.mock("modules/contracts/actions/update-contract-api", () => ({
  updateFunctionsAPI: () => ({
    type: "UPDATE_FUNCTIONS_API"
  }),
  updateEventsAPI: () => ({
    type: "UPDATE_EVENTS_API"
  })
}));

jest.mock("modules/transactions/actions/register-transaction-relay", () => ({
  registerTransactionRelay: () => ({
    type: "REGISTER_TRANSACTION_RELAY"
  })
}));

jest.mock("modules/app/actions/load-universe", () => ({
  loadUniverse: () => ({
    type: "LOAD_UNIVERSE"
  })
}));

jest.mock("modules/app/actions/verify-matching-network-ids", () => ({
  verifyMatchingNetworkIds: () => ({
    type: "VERIFY_MATCHING_NETWORK_IDS"
  })
}));

jest.mock("services/augurjs", () => ({
  connect: jest.fn(),
  augur: {
    augurNode: {
      getSyncData: jest.fn()
    },
    api: {
      Controller: {
        stopped: jest.fn()
      }
    },
    contracts: {
      addresses: {
        4: { Universe: "0xb0b" },
        3: { Universe: "0xc41231e2" }
      }
    },
    rpc: {
      getNetworkID: () => jest.fn(),
      eth: {
        accounts: jest.fn()
      },
      constants: {
        ACCOUNT_TYPES: {
          UNLOCKED_ETHEREUM_NODE: "unlockedEthereumNode",
          META_MASK: "metaMask"
        }
      }
    }
  }
}));

jest.mock("config/network.json", () => ({
  test: {
    "augur-node": "ws://127.0.0.1:9001",
    "ethereum-node": {
      http: "http://127.0.0.1:8545",
      ws: "ws://127.0.0.1:8546",
      pollingIntervalMilliseconds: 500,
      blockRetention: 100,
      connectionTimeout: 60000
    },
    universe: null,
    "bug-bounty": false,
    "bug-bounty-address": null,
    debug: {
      connect: true,
      broadcast: false
    }
  }
}));

describe("modules/app/actions/init-augur.js", () => {
  let connectSpy;
  let accountsSpy;
  let networkIdSpy;
  let stoppedSpy;

  const augurNodeWS = "wss://some.web.socket.com";
  const ethereumNodeConnectionInfo = {
    http: "http://some.eth.node.com",
    ws: "wss://some.eth.ws.node.com"
  };
  const middleware = [thunk];
  const mockStore = configureMockStore(middleware);
  const mockEnv = {
    "augur-node": augurNodeWS,
    "ethereum-node": ethereumNodeConnectionInfo
  };
  const realSetInterval = global.setInterval;
  const store = mockStore({
    ...realStore.getState(),
    env: mockEnv
  });

  beforeAll(() => {
    process.env.ETHEREUM_NETWORK = "test";
  });

  beforeEach(() => {
    global.setInterval = (f, interval) => {
      f();
    };
    store.clearActions();
  });

  afterEach(() => {
    global.setInterval = realSetInterval;
    store.clearActions();
    connectSpy.mockReset();
    accountsSpy.mockReset();
    networkIdSpy.mockReset();
    stoppedSpy.mockReset();
  });

  afterAll(() => {
    delete process.env.ETHEREUM_NETWORK;
  });

  const t1 = {
    description: "Should InitAugur successfully, with logged in account",
    assertions: done => {
      connectSpy = jest
        .spyOn(AugurJS, "connect")
        .mockImplementation((env, cb) => {
          cb(null, {
            ethereumNode: {
              ...ethereumNodeConnectionInfo,
              contracts: {},
              abi: {
                functions: {},
                events: {}
              }
            },
            augurNode: augurNodeWS
          });
        });

      accountsSpy = jest
        .spyOn(AugurJS.augur.rpc.eth, "accounts")
        .mockImplementation(cb => cb(null, ["0xa11ce"]));

      networkIdSpy = jest
        .spyOn(AugurJS.augur.rpc, "getNetworkID")
        .mockReturnValue(4);
      store.dispatch(
        initAugur({}, {}, (err, connInfo) => {
          expect(err).toBeUndefined();
          expect(connInfo).toBeUndefined();
          done();
        })
      );

      const expected = [
        { type: "UPDATE_ENV" },
        { type: "UPDATE_CONNECTION_STATUS" },
        { type: "UPDATE_CONTRACT_ADDRESSES" },
        { type: "UPDATE_FUNCTIONS_API" },
        { type: "UPDATE_EVENTS_API" },
        { type: "UPDATE_AUGUR_NODE_CONNECTION_STATUS" },
        { type: "REGISTER_TRANSACTION_RELAY" },
        { type: "LOAD_UNIVERSE" },
        { type: "CLOSE_MODAL" },
        { type: "SET_LOGIN_ACCOUNT" }
      ];

      expect(store.getActions()).toEqual(expected);
    }
  };

  const t2 = {
    description: "Should InitAugur successfully, not logged in",
    assertions: done => {
      connectSpy = jest
        .spyOn(AugurJS, "connect")
        .mockImplementation((env, cb) => {
          cb(null, {
            ethereumNode: {
              ...ethereumNodeConnectionInfo,
              contracts: {},
              abi: {
                functions: {},
                events: {}
              }
            },
            augurNode: augurNodeWS
          });
        });

      accountsSpy = jest
        .spyOn(AugurJS.augur.rpc.eth, "accounts")
        .mockImplementation(cb => cb(null, []));

      networkIdSpy = jest
        .spyOn(AugurJS.augur.rpc, "getNetworkID")
        .mockReturnValue(4);

      store.dispatch(
        initAugur({}, {}, (err, connInfo) => {
          expect(err).toBeUndefined();
          expect(connInfo).toBeUndefined();
          done();
        })
      );

      const expected = [
        { type: "UPDATE_ENV" },
        { type: "UPDATE_CONNECTION_STATUS" },
        { type: "UPDATE_CONTRACT_ADDRESSES" },
        { type: "UPDATE_FUNCTIONS_API" },
        { type: "UPDATE_EVENTS_API" },
        { type: "UPDATE_AUGUR_NODE_CONNECTION_STATUS" },
        { type: "REGISTER_TRANSACTION_RELAY" },
        { type: "LOAD_UNIVERSE" },
        { type: "CLOSE_MODAL" },
        { type: "LOGOUT" }
      ];

      expect(store.getActions()).toEqual(expected);
    }
  };

  const t3 = {
    description:
      "Should InitAugur successfully, not logged in, unexpectedNetworkId",
    assertions: done => {
      connectSpy = jest
        .spyOn(AugurJS, "connect")
        .mockImplementation((env, cb) => {
          cb(null, {
            ethereumNode: {
              ...ethereumNodeConnectionInfo,
              contracts: {},
              abi: {
                functions: {},
                events: {}
              }
            },
            augurNode: augurNodeWS
          });
        });

      accountsSpy = jest
        .spyOn(AugurJS.augur.rpc.eth, "accounts")
        .mockImplementation(cb => cb(null, []));

      networkIdSpy = jest
        .spyOn(AugurJS.augur.rpc, "getNetworkID")
        .mockReturnValue(3);

      stoppedSpy = jest
        .spyOn(AugurJS.augur.api.Controller, "stopped")
        .mockImplementation(() => {});

      store.dispatch(
        initAugur({}, {}, (err, connInfo) => {
          expect(err).toBeUndefined();
          expect(connInfo).toBeUndefined();
          done();
        })
      );

      const expected = [
        { type: "UPDATE_ENV" },
        { type: "UPDATE_CONNECTION_STATUS" },
        { type: "UPDATE_CONTRACT_ADDRESSES" },
        { type: "UPDATE_FUNCTIONS_API" },
        { type: "UPDATE_EVENTS_API" },
        { type: "UPDATE_AUGUR_NODE_CONNECTION_STATUS" },
        { type: "REGISTER_TRANSACTION_RELAY" },
        { type: "LOAD_UNIVERSE" },
        { type: "UPDATE_MODAL" },
        { type: "LOGOUT" }
      ];

      expect(store.getActions()).toEqual(expected);
    }
  };

  describe.each([t1, t2, t3])("initAugur", t => {
    test(t.description, done => t.assertions(done));
  });
  /*
  describe("initAugur", () => {
    const test = t => it(t.description, done => t.assertions(done));

    describe("connectAugur", () => {
      const test = t => it(t.description, done => t.assertions(done));

      test({
        description:
          "Should connectAugur successfully as an initial connection, with logged in account",
        assertions: done => {
          ReWireModule.__Rewire__("AugurJS", {
            connect: (env, cb) => {
              cb(null, {
                ethereumNode: {
                  ...ethereumNodeConnectionInfo,
                  contracts: {},
                  abi: {
                    functions: {},
                    events: {}
                  }
                },
                augurNode: augurNodeWS
              });
            },
            augur: {
              contracts: { addresses: { 4: { Universe: "0xb0b" } } },
              rpc: {
                getNetworkID: () => 4,
                eth: { accounts: cb => cb(null, ["0xa11ce"]) }
              },
              api: { Controller: { stopped: () => {} } }
            }
          });

          store.dispatch(
            connectAugur({}, mockEnv, true, (err, connInfo) => {
              assert.isUndefined(
                err,
                "callback passed to connectAugur had a first argument when expecting undefined."
              );
              assert.isUndefined(
                connInfo,
                "callback passed to connectAugur had a second argument when expecting undefined."
              );
              done();
            })
          );

          const expected = [
            { type: "UPDATE_CONNECTION_STATUS" },
            { type: "UPDATE_CONTRACT_ADDRESSES" },
            { type: "UPDATE_FUNCTIONS_API" },
            { type: "UPDATE_EVENTS_API" },
            { type: "UPDATE_AUGUR_NODE_CONNECTION_STATUS" },
            { type: "REGISTER_TRANSACTION_RELAY" },
            { type: "LOAD_UNIVERSE" },
            { type: "CLOSE_MODAL" },
            { type: "SET_LOGIN_ACCOUNT" }
          ];

          assert.deepEqual(
            store.getActions(),
            expected,
            `Didn't fire the expected actions`
          );
        }
      });
      test({
        description: "Should connectAugur successfully as a reconnection",
        assertions: done => {
          ReWireModule.__Rewire__("AugurJS", {
            connect: (env, cb) => {
              cb(null, {
                ethereumNode: {
                  ...ethereumNodeConnectionInfo,
                  contracts: {},
                  abi: {
                    functions: {},
                    events: {}
                  }
                },
                augurNode: augurNodeWS
              });
            },
            augur: {
              contracts: { addresses: { 4: { Universe: "0xb0b" } } },
              rpc: {
                getNetworkID: () => 4,
                eth: { accounts: cb => cb(null, []) }
              },
              api: { Controller: { stopped: () => {} } }
            }
          });

          store.dispatch(
            connectAugur({}, mockEnv, false, (err, connInfo) => {
              assert.isUndefined(
                err,
                "callback passed to connectAguur had a first argument when expecting undefined."
              );
              assert.isUndefined(
                connInfo,
                "callback passed to connectAguur had a second argument when expecting undefined."
              );
              done();
            })
          );
          const expected = [
            { type: "UPDATE_ENV" },
            { type: "UPDATE_CONNECTION_STATUS" },
            { type: "UPDATE_CONTRACT_ADDRESSES" },
            { type: "UPDATE_FUNCTIONS_API" },
            { type: "UPDATE_EVENTS_API" },
            { type: "UPDATE_AUGUR_NODE_CONNECTION_STATUS" },
            { type: "REGISTER_TRANSACTION_RELAY" },
            { type: "LOAD_UNIVERSE" }
          ];

          assert.deepEqual(
            store.getActions(),
            expected,
            `Didn't fire the expected actions`
          );
        }
      });
      test({
        description: "Should handle a undefined augurNode from AugurJS.connect",
        assertions: done => {
          ReWireModule.__Rewire__("AugurJS", {
            connect: (env, cb) => {
              cb(null, {
                ethereumNode: {
                  ...ethereumNodeConnectionInfo,
                  contracts: {},
                  abi: {
                    functions: {},
                    events: {}
                  }
                },
                augurNode: undefined
              });
            },
            augur: {
              contracts: {
                addresses: {
                  4: { Universe: "0xb0b" },
                  3: { Universe: "0xc41231e2" }
                }
              },
              rpc: {
                getNetworkID: () => 4,
                eth: { accounts: cb => cb(null, []) }
              }
            }
          });

          store.dispatch(
            connectAugur({}, mockEnv, false, (err, connInfo) => {
              assert.isNull(
                err,
                "callback passed to connectAugur had a first argument when expecting null."
              );
              assert.deepEqual(
                connInfo,
                {
                  ethereumNode: {
                    ...ethereumNodeConnectionInfo,
                    contracts: {},
                    abi: {
                      functions: {},
                      events: {}
                    }
                  },
                  augurNode: undefined
                },
                `Didn't return the expected connection info object on error.`
              );
              done();
            })
          );

          const expected = [];

          assert.deepEqual(
            store.getActions(),
            expected,
            `Didn't fire the expected actions`
          );
        }
      });
      test({
        description:
          "Should handle a undefined ethereumNode from AugurJS.connect",
        assertions: done => {
          ReWireModule.__Rewire__("AugurJS", {
            connect: (env, cb) => {
              cb(null, {
                ethereumNode: undefined,
                augurNode: augurNodeWS
              });
            },
            augur: {
              contracts: {
                addresses: {
                  4: { Universe: "0xb0b" },
                  3: { Universe: "0xc41231e2" }
                }
              },
              rpc: {
                getNetworkID: () => 4,
                eth: { accounts: cb => cb(null, []) }
              }
            }
          });

          store.dispatch(
            connectAugur({}, mockEnv, false, (err, connInfo) => {
              assert.isNull(
                err,
                "callback passed to connectAugur had a first argument when expecting null."
              );
              assert.deepEqual(
                connInfo,
                {
                  ethereumNode: undefined,
                  augurNode: augurNodeWS
                },
                `Didn't return the expected connection info object on error.`
              );
              done();
            })
          );

          const expected = [];

          assert.deepEqual(
            store.getActions(),
            expected,
            `Didn't fire the expected actions`
          );
        }
      });
      test({
        description: "Should handle a error object back from AugurJS.connect",
        assertions: done => {
          ReWireModule.__Rewire__("AugurJS", {
            connect: (env, cb) => {
              cb(
                { error: 2000, message: "There was a mistake." },
                {
                  ethereumNode: undefined,
                  augurNode: undefined
                }
              );
            },
            augur: {
              contracts: {
                addresses: {
                  4: { Universe: "0xb0b" },
                  3: { Universe: "0xc41231e2" }
                }
              },
              rpc: {
                getNetworkID: () => 4,
                eth: { accounts: cb => cb(null, []) }
              }
            }
          });

          store.dispatch(
            connectAugur({}, mockEnv, false, (err, connInfo) => {
              assert.deepEqual(
                err,
                { error: 2000, message: "There was a mistake." },
                `callback passed to connectAugur didn't recieve the expected error object.`
              );
              assert.deepEqual(
                connInfo,
                {
                  ethereumNode: undefined,
                  augurNode: undefined
                },
                `Didn't return the expected connection info object on error.`
              );
              done();
            })
          );

          const expected = [];

          assert.deepEqual(
            store.getActions(),
            expected,
            `Didn't fire the expected actions`
          );
        }
      });
    });
  });
  */
});
