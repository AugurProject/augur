import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import realStore from "src/store";

import { initAugur, connectAugur } from "modules/app/actions/init-augur";
import * as AugurJS from "src/services/augurjs";

const AugurJSActual = require.requireActual("src/services/augurjs");

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

jest.mock("modules/modal/actions/update-modal", () => ({
  updateModal: () => ({
    type: "UPDATE_MODAL"
  })
}));

jest.mock("services/augurjs", () => ({
  set mockConstants(cons) {
    this.constants = cons;
  },
  constants: {},
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
  AugurJS.mockConstants = AugurJSActual.constants;

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
        { type: "UPDATE_MODAL" },
        { type: "VERIFY_MATCHING_NETWORK_IDS" }
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
        { type: "UPDATE_MODAL" },
        { type: "VERIFY_MATCHING_NETWORK_IDS" }
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
        { type: "VERIFY_MATCHING_NETWORK_IDS" }
      ];

      expect(store.getActions()).toEqual(expected);
    }
  };

  describe.each([t1, t2, t3])("initAugur", t => {
    beforeAll(() => {
      if (connectSpy) {
        connectSpy.mockReset();
      }
      if (accountsSpy) {
        accountsSpy.mockReset();
      }
      if (networkIdSpy) {
        networkIdSpy.mockReset();
      }
      if (stoppedSpy) {
        stoppedSpy.mockReset();
      }
    });

    test(t.description, done => t.assertions(done));
  });

  const t4 = {
    description:
      "Should connectAugur successfully as an initial connection, with logged in account",
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
      networkIdSpy = jest
        .spyOn(AugurJS.augur.rpc, "getNetworkID")
        .mockReturnValue(4);
      accountsSpy = jest
        .spyOn(AugurJS.augur.rpc.eth, "accounts")
        .mockImplementation(cb => cb(null, ["0xa11ce"]));
      stoppedSpy = jest
        .spyOn(AugurJS.augur.api.Controller, "stopped")
        .mockImplementation(() => {});

      store.dispatch(
        connectAugur({}, mockEnv, true, (err, connInfo) => {
          expect(err).toBeUndefined();
          expect(connInfo).toBeUndefined();
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
        { type: "UPDATE_MODAL" },
        { type: "VERIFY_MATCHING_NETWORK_IDS" }
      ];

      expect(store.getActions()).toEqual(expected);
    }
  };

  const t5 = {
    description: "Should connectAugur successfully as a reconnection",
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
      stoppedSpy = jest
        .spyOn(AugurJS.augur.api.Controller, "stopped")
        .mockImplementation(() => {});

      store.dispatch(
        connectAugur({}, mockEnv, false, (err, connInfo) => {
          expect(err).toBeUndefined();
          expect(connInfo).toBeUndefined();
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
        { type: "LOAD_UNIVERSE" }
      ];

      expect(store.getActions()).toEqual(expected);
    }
  };

  const t6 = {
    description: "Should handle a undefined augurNode from AugurJS.connect",
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
            augurNode: undefined
          });
        });
      networkIdSpy = jest
        .spyOn(AugurJS.augur.rpc, "getNetworkID")
        .mockReturnValue(4);
      accountsSpy = jest
        .spyOn(AugurJS.augur.rpc.eth, "accounts")
        .mockImplementation(cb => cb(null, []));

      store.dispatch(
        connectAugur({}, mockEnv, false, (err, connInfo) => {
          expect(err).toBeNull();
          expect(connInfo).toEqual({
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
          done();
        })
      );

      expect(store.getActions()).toHaveLength(0);
    }
  };

  const t7 = {
    description: "Should handle a undefined ethereumNode from AugurJS.connect",
    assertions: done => {
      connectSpy = jest
        .spyOn(AugurJS, "connect")
        .mockImplementation((env, cb) => {
          cb(null, {
            ethereumNode: undefined,
            augurNode: augurNodeWS
          });
        });
      networkIdSpy = jest
        .spyOn(AugurJS.augur.rpc, "getNetworkID")
        .mockReturnValue(4);
      accountsSpy = jest
        .spyOn(AugurJS.augur.rpc.eth, "accounts")
        .mockImplementation(cb => cb(null, []));

      store.dispatch(
        connectAugur({}, mockEnv, false, (err, connInfo) => {
          expect(err).toBeNull();
          expect(connInfo).toEqual({
            ethereumNode: undefined,
            augurNode: augurNodeWS
          });
          done();
        })
      );

      expect(store.getActions()).toHaveLength(0);
    }
  };

  const t8 = {
    description: "Should handle a error object back from AugurJS.connect",
    assertions: done => {
      connectSpy = jest
        .spyOn(AugurJS, "connect")
        .mockImplementation((env, cb) => {
          cb(
            { error: 2000, message: "There was a mistake." },
            {
              ethereumNode: undefined,
              augurNode: undefined
            }
          );
        });
      networkIdSpy = jest
        .spyOn(AugurJS.augur.rpc, "getNetworkID")
        .mockReturnValue(4);
      accountsSpy = jest
        .spyOn(AugurJS.augur.rpc.eth, "accounts")
        .mockImplementation(cb => cb(null, []));

      store.dispatch(
        connectAugur({}, mockEnv, false, (err, connInfo) => {
          expect(err).toEqual({ error: 2000, message: "There was a mistake." });
          expect(connInfo).toEqual({
            ethereumNode: undefined,
            augurNode: undefined
          });
          done();
        })
      );

      expect(store.getActions()).toHaveLength(0);
    }
  };

  describe.each([t4, t5, t6, t7, t8])("initAugur", t => {
    beforeAll(() => {
      if (connectSpy) {
        connectSpy.mockReset();
      }
      if (accountsSpy) {
        accountsSpy.mockReset();
      }
      if (networkIdSpy) {
        networkIdSpy.mockReset();
      }
      if (stoppedSpy) {
        stoppedSpy.mockReset();
      }
    });
    test(t.description, done => {
      t.assertions(done);
    });
  });
});
