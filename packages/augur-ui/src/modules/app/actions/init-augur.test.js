import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import realStore from "src/store";

import * as updateEnvModule from "modules/app/actions/update-env";
import * as updateConnectionModule from "modules/app/actions/update-connection";
import * as updateContractAddressesModule from "modules/contracts/actions/update-contract-addresses";
import * as updateContractApiModule from "modules/contracts/actions/update-contract-api";
import * as registerTransactionRelayModule from "modules/transactions/actions/register-transaction-relay";
import * as loadUniverseModule from "modules/app/actions/load-universe";
import * as verifyMatchingNetworkIdsModule from "modules/app/actions/verify-matching-network-ids";

import { initAugur, connectAugur } from "modules/app/actions/init-augur";

jest.mock("config/network.json", () => ({
  test: {
    "augur-node": "ws://127.0.0.1:9001",
    "ethereum-node": {
      http: "http://127.0.0.1:8545",
      ws: "ws://127.0.0.1:8546",
      pollingIntervalMilliseconds: 5000,
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
  let mockAugur = {
    connect: (env, cb) => {
      cb(null, {
        ethereumNode: {
          http: "http://some.eth.node.com",
          ws: "wss://some.eth.ws.node.com",
          contracts: {},
          abi: {
            functions: {},
            events: {}
          }
        },
        augurNode: "wss://some.web.socket.com"
      });
    },
    augur: {
      api: {
        Controller: {
          stopped: () => {}
        }
      },
      rpc: {
        eth: {
          accounts: () => {}
        },
        constants: []
      },
      contracts: {
        addresses: {}
      }
    },
    constants: {
      ACCOUNT_TYPES: {
        UNLOCKED_ETHEREUM_NODE: "unlockedEthereumNode",
        META_MASK: "metaMask"
      }
    }
  };
  let augurModule;

  const ACTIONS = {
    UPDATE_ENV: { type: "UPDATE_ENV" },
    UPDATE_CONNECTION_STATUS: { type: "UPDATE_CONNECTION_STATUS" },
    UPDATE_AUGUR_NODE_CONNECTION_STATUS: {
      type: "UPDATE_AUGUR_NODE_CONNECTION_STATUS"
    },
    UPDATE_CONTRACT_ADDRESSES: { type: "UPDATE_CONTRACT_ADDRESSES" },
    UPDATE_FUNCTIONS_API: { type: "UPDATE_FUNCTIONS_API" },
    UPDATE_EVENTS_API: { type: "UPDATE_EVENTS_API" },
    LOAD_UNIVERSE: { type: "LOAD_UNIVERSE" },
    REGISTER_TRANSACTION_RELAY: { type: "REGISTER_TRANSACTION_RELAY" }
  };

  jest
    .spyOn(updateEnvModule, "updateEnv")
    .mockImplementation(() => ACTIONS.UPDATE_ENV);
  jest
    .spyOn(updateConnectionModule, "updateConnectionStatus")
    .mockImplementation(() => ACTIONS.UPDATE_CONNECTION_STATUS);
  jest
    .spyOn(updateContractAddressesModule, "updateContractAddresses")
    .mockImplementation(() => ACTIONS.UPDATE_CONTRACT_ADDRESSES);
  jest
    .spyOn(updateContractApiModule, "updateFunctionsAPI")
    .mockImplementation(() => ACTIONS.UPDATE_FUNCTIONS_API);
  jest
    .spyOn(updateContractApiModule, "updateEventsAPI")
    .mockImplementation(() => ACTIONS.UPDATE_EVENTS_API);
  jest
    .spyOn(updateConnectionModule, "updateAugurNodeConnectionStatus")
    .mockImplementation(() => ACTIONS.UPDATE_AUGUR_NODE_CONNECTION_STATUS);
  jest
    .spyOn(registerTransactionRelayModule, "registerTransactionRelay")
    .mockImplementation(() => ACTIONS.REGISTER_TRANSACTION_RELAY);
  jest
    .spyOn(loadUniverseModule, "loadUniverse")
    .mockImplementation(() => ACTIONS.LOAD_UNIVERSE);
  jest
    .spyOn(verifyMatchingNetworkIdsModule, "verifyMatchingNetworkIds")
    .mockImplementation(callback => () => callback(null, true));

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
  });

  describe("initAugur", () => {
    test("initialized augur successfully with logged in account", () => {
      mockAugur.augur.contracts = { 4: { Universe: "0xb0b" } };
      mockAugur.augur.rpc.eth = { accounts: cb => cb(null, ["0xa11ce"]) };
      mockAugur.augur.rpc.getNetworkID = jest.fn(() => 4);

      jest.doMock("services/augurjs", () => mockAugur);
      augurModule = require("services/augurjs");

      augurModule.augur.rpc = store.dispatch(
        initAugur({}, {}, (err, connInfo) => {
          expect(err).toBeUndefined();
          console.log("test");
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

    test("initialized augur successfully when not logged in", () => {
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

    test("initialized augur successfully when not logged in and unexpectedNetworkId", () => {
      mockAugur.augur.contracts = {
        addresses: {
          4: { Universe: "0xb0b" },
          3: { Universe: "0xc41231e2" }
        }
      };

      mockAugur.constants = {
        ACCOUNT_TYPES: {
          UNLOCKED_ETHEREUM_NODE: "unlockedEthereumNode",
          META_MASK: "metaMask"
        }
      };

      jest.doMock("services/augurjs", () => mockAugur);

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
      test("connectAugur was successful as an initial connection, with logged in account", () => {
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

      test("connectAugur successfully reconnects", () => {
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
      });

      test("handled an undefined augurNode from AugurJS.connect", () => {
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

      test("handled an undefined ethereumNode from AugurJS.connect", () => {
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

      test("handled an error object back from AugurJS.connect", () => {
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
