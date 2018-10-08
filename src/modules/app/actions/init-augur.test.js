import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import realStore from "src/store";
import * as augur from "services/augurjs";

import { initAugur, connectAugur } from "modules/app/actions/init-augur";

jest.mock("services/augurjs");

jest.mock("modules/app/actions/update-env");
jest.mock("modules/app/actions/update-connection");
jest.mock("modules/contracts/actions/update-contract-addresses");
jest.mock("modules/contracts/actions/update-contract-api");
jest.mock("modules/transactions/actions/register-transaction-relay");
jest.mock("modules/app/actions/load-universe");
jest.mock("modules/app/actions/verify-matching-network-ids");

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
  const ethereumNodeConnectionInfo = {
    http: "http://some.eth.node.com",
    ws: "wss://some.eth.ws.node.com"
  };
  const middleware = [thunk];
  const mockStore = configureMockStore(middleware);
  const augurNodeWS = "wss://some.web.socket.com";
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
    global.setInterval = f => {
      f();
    };

    store.clearActions();
  });

  afterEach(() => {
    global.setInterval = realSetInterval;
    store.clearActions();
  });

  afterAll(() => {
    delete process.env.ETHEREUM_NETWORK;
    augur.resetConstants();
  });

  describe("initAugur", () => {
    augur.mockConnect = (env, cb) => {
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
    };

    augur.rpc.mockEth = { accounts: cb => cb(null, ["0xa11ce"]) };
    augur.mockContracts = { addresses: { 4: { Universe: "0xb0b" } } };
    augur.mockConstants = {
      ACCOUNT_TYPES: {
        UNLOCKED_ETHEREUM_NODE: "unlockedEthereumNode",
        META_MASK: "metaMask"
      }
    };

    test("if initializes augur successfully with logged in account", () => {
      store.dispatch(
        initAugur({}, {}, (err, connInfo) => {
          expect(err).toBeUndefined();
          expect(connInfo).toBeUndefined();
          expect(store.getActions()).deepEqual([
            { type: "UPDATE_ENV" },
            { type: "UPDATE_CONNECTION_STATUS" },
            { type: "UPDATE_CONTRACT_ADDRESSES" },
            { type: "UPDATE_FUNCTIONS_API" },
            { type: "UPDATE_EVENTS_API" },
            { type: "UPDATE_AUGUR_NODE_CONNECTION_STATUS" },
            { type: "REGISTER_TRANSACTION_RELAY" },
            { type: "LOAD_UNIVERSE" },
            { type: "CLOSE_MODAL" }
          ]);
        })
      );
    });

    test("if initializes augur successfully when not logged in", () => {
      augur.mockConnect = (env, cb) => {
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
      };

      augur.mockContracts = { addresses: { 4: { Universe: "0xb0b" } } };
      augur.rpc.mockEth = { accounts: cb => cb(null, []) };
      augur.api.mockController = { stopped: () => {} };

      store.dispatch(
        initAugur({}, {}, (err, connInfo) => {
          expect(err).toBeUndefined();
          expect(connInfo).toBeUndefined();
          expect(store.getActions).deepEqual([
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
          ]);
        })
      );
    });

    test("if initializes augur successfully when not logged in and unexpectedNetworkId", () => {
      augur.mockConnect = (env, cb) => {
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
      };

      augur.mockContracts = {
        addresses: {
          4: { Universe: "0xb0b" },
          3: { Universe: "0xc41231e2" }
        }
      };

      augur.mockConstants = {
        ACCOUNT_TYPES: {
          UNLOCKED_ETHEREUM_NODE: "unlockedEthereumNode",
          META_MASK: "metaMask"
        }
      };

      augur.rpc.mockEth = { accounts: cb => cb(null, []) };
      augur.api.mockController = { stopped: () => {} };

      store.dispatch(
        initAugur({}, {}, (err, connInfo) => {
          expect(err).toBeUndefined();
          expect(connInfo).toBeUndefined();
          expect(store.getActions()).deepEqual([
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
          ]);
        })
      );
    });

    describe("connectAugur", () => {
      test("connectAugur as an initial connection, with logged in account", () => {
        augur.mockConnect = (env, cb) => {
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
        };

        augur.mockContracts = { addresses: { 4: { Universe: "0xb0b" } } };
        augur.rpc.mockEth = { accounts: cb => cb(null, ["0xa11ce"]) };
        augur.api.Controller = { stopped: () => {} };

        store.dispatch(
          connectAugur({}, mockEnv, true, (err, connInfo) => {
            expect(err).toBeUndefined();
            expect(connInfo).toBeUndefined();
            expect(store.getActions()).deepEqual([
              { type: "UPDATE_CONNECTION_STATUS" },
              { type: "UPDATE_CONTRACT_ADDRESSES" },
              { type: "UPDATE_FUNCTIONS_API" },
              { type: "UPDATE_EVENTS_API" },
              { type: "UPDATE_AUGUR_NODE_CONNECTION_STATUS" },
              { type: "REGISTER_TRANSACTION_RELAY" },
              { type: "LOAD_UNIVERSE" },
              { type: "CLOSE_MODAL" },
              { type: "SET_LOGIN_ACCOUNT" }
            ]);
          })
        );
      });

      test("if connectAugur successfully reconnects", () => {
        augur.mockConnect = (env, cb) => {
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
        };

        augur.mockContracts = { addresses: { 4: { Universe: "0xb0b" } } };

        augur.mockConstants = {
          ACCOUNT_TYPES: {
            UNLOCKED_ETHEREUM_NODE: "unlockedEthereumNode",
            META_MASK: "metaMask"
          }
        };

        augur.rpc.mockEth = { accounts: cb => cb(null, []) };
        augur.api.mockController = { stopped: () => {} };
      });

      store.dispatch(
        connectAugur({}, mockEnv, false, (err, connInfo) => {
          expect(err).toBeUndefined();
          expect(connInfo).toBeUndefined();
          expect(store.getActions()).deepEqual([
            { type: "UPDATE_ENV" },
            { type: "UPDATE_CONNECTION_STATUS" },
            { type: "UPDATE_CONTRACT_ADDRESSES" },
            { type: "UPDATE_FUNCTIONS_API" },
            { type: "UPDATE_EVENTS_API" },
            { type: "UPDATE_AUGUR_NODE_CONNECTION_STATUS" },
            { type: "REGISTER_TRANSACTION_RELAY" },
            { type: "LOAD_UNIVERSE" }
          ]);
        })
      );

      test("if handles an undefined augurNode from AugurJS.connect", () => {
        augur.mockConnect = (env, cb) => {
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
        };

        augur.mockContracts = {
          addresses: {
            4: { Universe: "0xb0b" },
            3: { Universe: "0xc41231e2" }
          }
        };

        augur.rpc.mockEth = { accounts: cb => cb(null, []) };

        store.dispatch(
          connectAugur({}, mockEnv, false, (err, connInfo) => {
            expect(err).toBeNull();
            expect(connInfo).deepEqual({
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
            expect(store.getActions()).deepEqual([]);
          })
        );
      });

      test("if handles an undefined ethereumNode from AugurJS.connect", () => {
        augur.mockConnect = (env, cb) => {
          cb(null, {
            ethereumNode: undefined,
            augurNode: augurNodeWS
          });
        };

        augur.mockContracts = {
          addresses: {
            4: { Universe: "0xb0b" },
            3: { Universe: "0xc41231e2" }
          }
        };

        augur.mockConstants = {
          ACCOUNT_TYPES: {
            UNLOCKED_ETHEREUM_NODE: "unlockedEthereumNode",
            META_MASK: "metaMask"
          }
        };

        augur.rpc.mockEth = { accounts: cb => cb(null, []) };

        store.dispatch(
          connectAugur({}, mockEnv, false, (err, connInfo) => {
            expect(err).toBeNull();
            expect(connInfo).deepEqual({
              ethereumNode: undefined,
              augurNode: augurNodeWS
            });
            expect(store.getActions()).deepEqual([]);
          })
        );
      });

      test("if handles an error object back from AugurJS.connect", () => {
        augur.mockConnect = (env, cb) => {
          cb(
            { error: 2000, message: "There was a mistake." },
            {
              ethereumNode: undefined,
              augurNode: undefined
            }
          );
        };

        augur.mockContracts = {
          addresses: {
            4: { Universe: "0xb0b" },
            3: { Universe: "0xc41231e2" }
          }
        };

        augur.rpc.mockEth = { accounts: cb => cb(null, []) };

        store.dispatch(
          connectAugur({}, mockEnv, false, (err, connInfo) => {
            expect(err).deepEqual({
              error: 2000,
              message: "There was a mistake."
            });
            expect(connInfo).deepEqual({
              ethereumNode: undefined,
              augurNode: undefined
            });
            expect(store.getActions()).toHaveLength(0);
          })
        );
      });
    });
  });
});
