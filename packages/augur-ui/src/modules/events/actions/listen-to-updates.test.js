import mockStore from "test/mockStore";
import { listenToUpdates } from "modules/events/actions/listen-to-updates";
import * as augurjs from "services/augurjs";
import * as loadMarketsInfoModule from "modules/markets/actions/load-markets-info";
import * as loadUnclaimedFeesModule from "modules/markets/actions/market-creator-fees-management";
import * as convertLogsToTransactionsModule from "modules/transactions/actions/convert-logs-to-transactions";
import * as updateAssetsModule from "modules/auth/actions/update-assets";
import * as loadReportingModule from "modules/reports/actions/load-reporting";

jest.mock("services/augurjs");

describe("events/actions/listen-to-updates", () => {
  describe("setup shape tests", () => {
    const store = mockStore.mockStore({});
    const ACTIONS = {
      STOP_BLOCK_LISTENERS: { type: "STOP_BLOCK_LISTENERS" },
      STOP_AUGUR_NODE_EVENT_LISTENERS: {
        type: "STOP_AUGUR_NODE_EVENT_LISTENERS"
      },
      START_BLOCK_LISTENERS: { type: "START_BLOCK_LISTENERS" },
      START_AUGUR_NODE_EVENT_LISTENERS: {
        type: "START_AUGUR_NODE_EVENT_LISTENERS"
      },
      NODES_AUGUR_ON_SET: { type: "NODES_AUGUR_ON_SET" },
      NODES_ETHEREUM_ON_SET: { type: "NODES_ETHEREUM_ON_SET" }
    };

    afterEach(() => {
      store.clearActions();
    });

    beforeAll(() => {
      jest
        .spyOn(augurjs.augur.events, "stopBlockListeners")
        .mockImplementationOnce(() =>
          store.dispatch(ACTIONS.STOP_BLOCK_LISTENERS)
        );
      jest
        .spyOn(augurjs.augur.events, "stopAugurNodeEventListeners")
        .mockImplementationOnce(() =>
          store.dispatch(ACTIONS.STOP_AUGUR_NODE_EVENT_LISTENERS)
        );
      jest
        .spyOn(augurjs.augur.events, "startBlockListeners")
        .mockImplementationOnce(listeners => {
          const expected = "function";
          expect(typeof listeners.onAdded).toStrictEqual(expected);
          expect(typeof listeners.onRemoved).toStrictEqual(expected);
          store.dispatch(ACTIONS.START_BLOCK_LISTENERS);
        });
      jest
        .spyOn(augurjs.augur.events, "startAugurNodeEventListeners")
        .mockImplementationOnce(listeners => {
          const expected = "function";
          expect(typeof listeners.MarketCreated).toStrictEqual(expected);
          expect(typeof listeners.InitialReportSubmitted).toStrictEqual(
            expected
          );
          expect(typeof listeners.MarketCreated).toStrictEqual(expected);
          expect(typeof listeners.TokensTransferred).toStrictEqual(expected);
          expect(typeof listeners.OrderCanceled).toStrictEqual(expected);
          expect(typeof listeners.OrderCreated).toStrictEqual(expected);
          expect(typeof listeners.OrderFilled).toStrictEqual(expected);
          expect(typeof listeners.TradingProceedsClaimed).toStrictEqual(
            expected
          );
          expect(typeof listeners.MarketFinalized).toStrictEqual(expected);
          expect(typeof listeners.UniverseForked).toStrictEqual(expected);
          expect(typeof listeners.FeeWindowCreated).toStrictEqual(expected);
          store.dispatch(ACTIONS.START_AUGUR_NODE_EVENT_LISTENERS);
        });
      jest
        .spyOn(augurjs.augur.events.nodes.augur, "on")
        .mockImplementationOnce((label, onDisconnect) => {
          expect(label).toStrictEqual("disconnect");
          expect(typeof onDisconnect).toStrictEqual("function");
          store.dispatch(ACTIONS.NODES_AUGUR_ON_SET);
        });
      jest
        .spyOn(augurjs.augur.events.nodes.ethereum, "on")
        .mockImplementationOnce((label, onDisconnect) => {
          expect(label).toStrictEqual("disconnect");
          expect(typeof onDisconnect).toStrictEqual("function");
          store.dispatch(ACTIONS.NODES_ETHEREUM_ON_SET);
        });
    });

    test("Handled clearing all listeners then setting all listeners when called.", () => {
      store.dispatch(listenToUpdates({}));
      const actual = store.getActions();
      expect(actual).toEqual([
        ACTIONS.STOP_BLOCK_LISTENERS,
        ACTIONS.STOP_AUGUR_NODE_EVENT_LISTENERS,
        ACTIONS.START_BLOCK_LISTENERS,
        ACTIONS.START_AUGUR_NODE_EVENT_LISTENERS,
        ACTIONS.NODES_AUGUR_ON_SET,
        ACTIONS.NODES_ETHEREUM_ON_SET
      ]);
    });
  });

  describe("MarketState", () => {
    let state;
    let store;

    beforeEach(() => {
      state = {
        universe: { id: "UNIVERSE_ADDRESS" }
      };
      store = mockStore.mockStore(state);
    });

    afterEach(() => {
      store.clearActions();
    });

    beforeAll(() => {
      jest
        .spyOn(loadMarketsInfoModule, "loadMarketsInfo")
        .mockImplementation(marketIds => ({
          type: "LOAD_MARKETS_INFO",
          marketIds
        }));

      jest
        .spyOn(augurjs.augur.events, "stopBlockListeners")
        .mockImplementation(() => {});
      jest
        .spyOn(augurjs.augur.events, "stopAugurNodeEventListeners")
        .mockImplementation(() => {});
      jest
        .spyOn(augurjs.augur.events, "startBlockListeners")
        .mockImplementation(() => {});
      jest
        .spyOn(augurjs.augur.events.nodes.augur, "on")
        .mockImplementation(() => {});
      jest
        .spyOn(augurjs.augur.events.nodes.ethereum, "on")
        .mockImplementation(() => {});
    });

    test("it should handle calling market state change", () => {
      jest
        .spyOn(augurjs.augur.events, "startAugurNodeEventListeners")
        .mockImplementationOnce(listeners =>
          listeners.MarketState(null, {
            marketId: "MARKET_ADDRESS",
            universe: "UNIVERSE_ADDRESS"
          })
        );
      store.dispatch(listenToUpdates({}));
      expect(store.getActions()).toEqual([
        { type: "LOAD_MARKETS_INFO", marketIds: ["MARKET_ADDRESS"] }
      ]);
    });

    test("Handled calling market state change with log set to empty array", () => {
      jest
        .spyOn(augurjs.augur.events, "startAugurNodeEventListeners")
        .mockImplementationOnce(listeners => listeners.MarketState(null, []));
      store.dispatch(listenToUpdates({}));
      expect(store.getActions()).toEqual([]);
    });
  });

  describe("InitialReportSubmitted", () => {
    let state;
    let store;

    beforeEach(() => {
      state = {
        universe: { id: "UNIVERSE_ADDRESS" },
        loginAccount: { address: "MY_ADDRESS" }
      };
      store = mockStore.mockStore(state);
    });

    afterEach(() => {
      store.clearActions();
    });

    beforeAll(() => {
      jest
        .spyOn(loadMarketsInfoModule, "loadMarketsInfo")
        .mockImplementation(marketIds => ({
          type: "LOAD_MARKETS_INFO",
          marketIds
        }));
      jest
        .spyOn(loadUnclaimedFeesModule, "loadUnclaimedFees")
        .mockImplementation(marketIds => ({
          type: "UPDATE_UNCLAIMED_DATA",
          marketIds
        }));
      jest
        .spyOn(convertLogsToTransactionsModule, "updateLoggedTransactions")
        .mockImplementation(log => ({
          type: "UPDATE_LOGGED_TRANSACTIONS",
          log
        }));
      jest.spyOn(updateAssetsModule, "updateAssets").mockImplementation(() => ({
        type: "UPDATE_ASSETS"
      }));
      jest
        .spyOn(loadReportingModule, "loadReporting")
        .mockImplementation(() => ({
          type: "LOAD_REPORTING"
        }));
      jest
        .spyOn(augurjs.augur.events, "stopBlockListeners")
        .mockImplementation(() => {});
      jest
        .spyOn(augurjs.augur.events, "stopAugurNodeEventListeners")
        .mockImplementation(() => {});
      jest
        .spyOn(augurjs.augur.events, "startBlockListeners")
        .mockImplementation(() => {});
      jest
        .spyOn(augurjs.augur.events.nodes.augur, "on")
        .mockImplementation(() => {});
      jest
        .spyOn(augurjs.augur.events.nodes.ethereum, "on")
        .mockImplementation(() => {});
    });

    test("Handled calling initial report not designated reporter", () => {
      jest
        .spyOn(augurjs.augur.events, "startAugurNodeEventListeners")
        .mockImplementationOnce(listeners =>
          listeners.InitialReportSubmitted(null, {
            eventName: "InitialReportSubmitted",
            market: "MARKET_ADDRESS",
            reporter: "REPORTER_ADDRESS",
            universe: "UNIVERSE_ADDRESS"
          })
        );
      store.dispatch(listenToUpdates({}));
      expect(store.getActions()).toEqual([
        { type: "LOAD_MARKETS_INFO", marketIds: ["MARKET_ADDRESS"] },
        { type: "UPDATE_UNCLAIMED_DATA", marketIds: ["MARKET_ADDRESS"] },
        { type: "LOAD_REPORTING" }
      ]);
    });

    test("Handled calling initial report IS designated reporter", () => {
      jest
        .spyOn(augurjs.augur.events, "startAugurNodeEventListeners")
        .mockImplementation(listeners =>
          listeners.InitialReportSubmitted(null, {
            eventName: "InitialReportSubmitted",
            market: "MARKET_ADDRESS",
            reporter: "MY_ADDRESS",
            universe: "UNIVERSE_ADDRESS"
          })
        );
      store.dispatch(listenToUpdates({}));
      expect(store.getActions()).toEqual([
        { type: "LOAD_MARKETS_INFO", marketIds: ["MARKET_ADDRESS"] },
        { type: "UPDATE_UNCLAIMED_DATA", marketIds: ["MARKET_ADDRESS"] },
        { type: "LOAD_REPORTING" },
        { type: "UPDATE_ASSETS" },
        {
          type: "UPDATE_LOGGED_TRANSACTIONS",
          log: {
            eventName: "InitialReportSubmitted",
            market: "MARKET_ADDRESS",
            reporter: "MY_ADDRESS",
            universe: "UNIVERSE_ADDRESS"
          }
        }
      ]);
    });
  });
  describe("InitialReporterRedeemed", () => {
    beforeAll(() => {
      jest
        .spyOn(loadMarketsInfoModule, "loadMarketsInfo")
        .mockImplementation(marketIds => ({
          type: "LOAD_MARKETS_INFO",
          marketIds
        }));
      jest
        .spyOn(loadUnclaimedFeesModule, "loadUnclaimedFees")
        .mockImplementation(marketIds => ({
          type: "UPDATE_UNCLAIMED_DATA",
          marketIds
        }));
      jest
        .spyOn(convertLogsToTransactionsModule, "updateLoggedTransactions")
        .mockImplementation(log => ({
          type: "UPDATE_LOGGED_TRANSACTIONS",
          log
        }));
      jest.spyOn(updateAssetsModule, "updateAssets").mockImplementation(() => ({
        type: "UPDATE_ASSETS"
      }));
      jest
        .spyOn(loadReportingModule, "loadReporting")
        .mockImplementation(() => ({
          type: "LOAD_REPORTING"
        }));
      jest
        .spyOn(augurjs.augur.events, "stopBlockListeners")
        .mockImplementation(() => {});
      jest
        .spyOn(augurjs.augur.events, "stopAugurNodeEventListeners")
        .mockImplementation(() => {});
      jest
        .spyOn(augurjs.augur.events, "startBlockListeners")
        .mockImplementation(() => {});
      jest
        .spyOn(augurjs.augur.events.nodes.augur, "on")
        .mockImplementation(() => {});
      jest
        .spyOn(augurjs.augur.events.nodes.ethereum, "on")
        .mockImplementation(() => {});
    });

    test("Handled calling initial reporter redeemed not designated reporter", () => {
      const state = {
        universe: { id: "UNIVERSE_ADDRESS" },
        loginAccount: { address: "MY_ADDRESS" }
      };
      const store = mockStore.mockStore(state);
      jest
        .spyOn(augurjs.augur.events, "startAugurNodeEventListeners")
        .mockImplementation(listeners =>
          listeners.InitialReporterRedeemed(null, {
            eventName: "InitialReporterRedeemed",
            market: "MARKET_ADDRESS",
            reporter: "REPORTER_ADDRESS",
            universe: "UNIVERSE_ADDRESS"
          })
        );
      store.dispatch(listenToUpdates({}));
      expect(store.getActions()).toEqual([
        { type: "LOAD_MARKETS_INFO", marketIds: ["MARKET_ADDRESS"] },
        { type: "UPDATE_UNCLAIMED_DATA", marketIds: ["MARKET_ADDRESS"] }
      ]);
    });

    test("Handled calling initial reporter redeemed IS designated reporter", () => {
      const state = {
        universe: { id: "UNIVERSE_ADDRESS" },
        loginAccount: { address: "MY_ADDRESS" }
      };
      const store = mockStore.mockStore(state);
      jest
        .spyOn(augurjs.augur.events, "startAugurNodeEventListeners")
        .mockImplementation(listeners =>
          listeners.InitialReporterRedeemed(null, {
            eventName: "InitialReporterRedeemed",
            market: "MARKET_ADDRESS",
            reporter: "MY_ADDRESS",
            universe: "UNIVERSE_ADDRESS"
          })
        );
      store.dispatch(listenToUpdates({}));
      expect(store.getActions()).toEqual([
        { type: "LOAD_MARKETS_INFO", marketIds: ["MARKET_ADDRESS"] },
        { type: "UPDATE_UNCLAIMED_DATA", marketIds: ["MARKET_ADDRESS"] },
        { type: "UPDATE_ASSETS" },
        { type: "LOAD_REPORTING" },
        {
          type: "UPDATE_LOGGED_TRANSACTIONS",
          log: {
            eventName: "InitialReporterRedeemed",
            market: "MARKET_ADDRESS",
            reporter: "MY_ADDRESS",
            universe: "UNIVERSE_ADDRESS"
          }
        }
      ]);
    });
  });
  describe("TokensTransferred", () => {
    beforeAll(() => {
      jest
        .spyOn(augurjs.augur.events, "stopBlockListeners")
        .mockImplementation(() => {});
      jest
        .spyOn(augurjs.augur.events, "stopAugurNodeEventListeners")
        .mockImplementation(() => {});
      jest
        .spyOn(augurjs.augur.events, "startBlockListeners")
        .mockImplementation(() => {});
      jest
        .spyOn(augurjs.augur.events.nodes.augur, "on")
        .mockImplementation(() => {});
      jest
        .spyOn(augurjs.augur.events.nodes.ethereum, "on")
        .mockImplementation(() => {});
    });

    test("Handled calling TokensTransferred with to address different from current address", () => {
      const state = {
        universe: { id: "UNIVERSE_ADDRESS" },
        loginAccount: { address: "MY_ADDRESS" }
      };
      const store = mockStore.mockStore(state);
      jest
        .spyOn(augurjs.augur.events, "startAugurNodeEventListeners")
        .mockImplementation(listeners =>
          listeners.TokensTransferred(null, {
            eventName: "TokensTransferred",
            market: "MARKET_ADDRESS",
            to: "NOT_MY_ADDRESS",
            universe: "UNIVERSE_ADDRESS"
          })
        );
      store.dispatch(listenToUpdates({}));
      expect(store.getActions()).toHaveLength(0);
    });
  });
});
