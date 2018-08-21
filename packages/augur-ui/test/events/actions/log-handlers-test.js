import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";

import {
  handleTradingProceedsClaimedLog,
  handleTokensMintedLog,
  handleCompleteSetsSoldLog,
  __RewireAPI__
} from "modules/events/actions/log-handlers";

describe("modules/events/actions/log-handlers.js", () => {
  let store;
  afterEach(() => {
    store.clearActions();
    __RewireAPI__.__ResetDependency__("isCurrentMarket");
  });

  const test = t =>
    it(t.description, () => {
      store = configureMockStore([thunk])({ ...t.state });
      __RewireAPI__.__Rewire__("isCurrentMarket", t.stub.isCurrentMarket);

      t.assertions(store);
    });

  describe("log handlers", () => {
    const ACTIONS = {
      LOAD_ACCOUNT_TRADES: "LOAD_ACCOUNT_TRADES",
      UPDATE_LOGGED_TRANSACTIONS: "UPDATE_LOGGED_TRANSACTIONS",
      LOAD_REPORTING_WINDOW: "LOAD_REPORTING_WINDOW",
      GET_WINNING_BALANCE: "GET_WINNING_BALANCE",
      LOAD_BID_ASKS: "LOAD_BID_ASKS"
    };

    beforeEach(() => {
      __RewireAPI__.__Rewire__("updateLoggedTransactions", log => ({
        type: ACTIONS.UPDATE_LOGGED_TRANSACTIONS,
        data: {
          log
        }
      }));
      __RewireAPI__.__Rewire__("loadAccountTrades", options => ({
        type: ACTIONS.LOAD_ACCOUNT_TRADES,
        data: {
          marketId: options.marketId
        }
      }));
      __RewireAPI__.__Rewire__("loadReportingWindowBounds", log => ({
        type: ACTIONS.LOAD_REPORTING_WINDOW
      }));
      __RewireAPI__.__Rewire__("getWinningBalance", marketIds => ({
        type: ACTIONS.GET_WINNING_BALANCE,
        data: {
          marketIds
        }
      }));
      __RewireAPI__.__Rewire__("loadBidAsks", options => ({
        type: ACTIONS.LOAD_BID_ASKS,
        data: {
          marketId: options.marketId
        }
      }));
    });

    afterEach(() => {
      __RewireAPI__.__ResetDependency__("loadAccountTrades");
      __RewireAPI__.__ResetDependency__("updateLoggedTransactions");
      __RewireAPI__.__ResetDependency__("loadReportingWindowBounds");
      __RewireAPI__.__ResetDependency__("getWinningBalance");
      __RewireAPI__.__ResetDependency__("isCurrentMarket");
      __RewireAPI__.__ResetDependency__("loadBidAsks");
    });

    test({
      description: `Should fire off update and load account trades if the sell complete set log includes the account address`,
      state: {
        loginAccount: {
          address: "0xb0b"
        }
      },
      stub: {
        isCurrentMarket: () => false
      },
      assertions: store => {
        const log = {
          marketId: "0xdeadbeef",
          account: "0xb0b"
        };
        store.dispatch(handleCompleteSetsSoldLog(log));

        const actual = store.getActions();

        const expected = [
          {
            type: ACTIONS.UPDATE_LOGGED_TRANSACTIONS,
            data: {
              log
            }
          },
          {
            type: ACTIONS.LOAD_ACCOUNT_TRADES,
            data: {
              marketId: "0xdeadbeef"
            }
          }
        ];

        assert.deepEqual(actual, expected, `Dispatched unexpected actions.`);
      }
    });

    test({
      description: `Shouldn't fire off update and load account trades if the sell complete set log doesn't include the account address`,
      state: {
        loginAccount: {
          address: "0xb0b"
        }
      },
      stub: {
        isCurrentMarket: () => false
      },
      assertions: store => {
        const log = {
          marketId: "0xdeadbeef",
          account: "0xa11ce"
        };
        store.dispatch(handleCompleteSetsSoldLog(log));

        const actual = store.getActions();

        const expected = [];

        assert.deepEqual(actual, expected, `Dispatched unexpected actions.`);
      }
    });

    test({
      description: `should process token mint log`,
      state: {
        loginAccount: {
          address: "0xb0b"
        }
      },
      stub: {
        isCurrentMarket: () => false
      },
      assertions: store => {
        const log = {
          marketId: "0xdeadbeef",
          target: "0xb0b"
        };
        store.dispatch(handleTokensMintedLog(log));
        const actual = store.getActions();
        const expected = [{ type: ACTIONS.LOAD_REPORTING_WINDOW }];
        assert.deepEqual(actual, expected, `Dispatched unexpected actions.`);
      }
    });

    test({
      description: `should process token mint log when address does not match`,
      state: {
        loginAccount: {
          address: "0xb0b111"
        }
      },
      stub: {
        isCurrentMarket: () => false
      },
      assertions: store => {
        const log = {
          marketId: "0xdeadbeef",
          target: "0xb0b"
        };
        store.dispatch(handleTokensMintedLog(log));
        const actual = store.getActions();
        const expected = [];
        assert.deepEqual(actual, expected, `Dispatched unexpected actions.`);
      }
    });

    test({
      description: `should process trading proceeds claimed log`,
      state: {
        loginAccount: {
          address: "0xb0b"
        },
        marketsData: {
          "0xdeadbeef": {}
        }
      },
      stub: {
        isCurrentMarket: () => true
      },
      assertions: store => {
        const log = {
          market: "0xdeadbeef",
          sender: "0xb0b"
        };
        store.dispatch(handleTradingProceedsClaimedLog(log));
        const actual = store.getActions();
        const expected = [
          {
            type: ACTIONS.UPDATE_LOGGED_TRANSACTIONS,
            data: {
              log
            }
          },
          {
            type: ACTIONS.LOAD_ACCOUNT_TRADES,
            data: {
              marketId: "0xdeadbeef"
            }
          },
          {
            type: ACTIONS.GET_WINNING_BALANCE,
            data: {
              marketIds: ["0xdeadbeef"]
            }
          }
        ];
        assert.deepEqual(actual, expected, `Dispatched unexpected actions.`);
      }
    });

    test({
      description: `should process trading proceeds claimed log when address does not match`,
      state: {
        loginAccount: {
          address: "0xb0b11"
        },
        marketsData: {
          "0xdeadbeef": {}
        }
      },
      stub: {
        isCurrentMarket: () => false
      },
      assertions: store => {
        const log = {
          market: "0xdeadbeef",
          sender: "0xb0b"
        };
        store.dispatch(handleTradingProceedsClaimedLog(log));
        const actual = store.getActions();
        const expected = [];
        assert.deepEqual(actual, expected, `Dispatched unexpected actions.`);
      }
    });
  });
});
