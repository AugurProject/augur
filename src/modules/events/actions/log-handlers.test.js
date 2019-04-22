import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";

import {
  handleTradingProceedsClaimedLog,
  handleTokensMintedLog,
  handleCompleteSetsSoldLog
} from "modules/events/actions/log-handlers";

import * as isCurrentMarketModule from "modules/trades/helpers/is-current-market";
import * as convertLogsToTransactionsModule from "modules/transactions/actions/convert-logs-to-transactions";
import * as loadReportingWindowBoundsModule from "modules/reports/actions/load-reporting-window-bounds";
import * as getWinningBalanceModule from "modules/reports/actions/get-winning-balance";
import * as loadMarketOpenOrdersModule from "modules/orders/actions/load-market-open-orders";
import * as updateAssetsModule from "modules/auth/actions/update-assets";
import * as loadAccountPositionsModule from "modules/positions/actions/load-account-positions";

describe("modules/events/actions/log-handlers.js", () => {
  describe("log handlers", () => {
    let store;
    let isCurrentMarketSpy;
    let updateLoggedTransactionsSpy;
    let loadAccountTradesSpy;
    let loadReportingWindowBoundsSpy;
    let getWinningBalanceSpy;
    let loadMarketOpenOrdersSpy;
    let loadAccountPositions;
    let updateAssetsSpy;
    const ACTIONS = {
      UPDATE_LOGGED_TRANSACTIONS: "UPDATE_LOGGED_TRANSACTIONS",
      UPDATE_ASSETS: "UPDATE_ASSETS",
      LOAD_REPORTING_WINDOW: "LOAD_REPORTING_WINDOW",
      GET_WINNING_BALANCE: "GET_WINNING_BALANCE",
      LOAD_MARKET_OPEN_ORDERS: "LOAD_MARKET_OPEN_ORDERS",
      LOAD_ACCOUNT_POSITIONS: "LOAD_ACCOUNT_POSITIONS"
    };

    beforeAll(() => {
      updateLoggedTransactionsSpy = jest
        .spyOn(convertLogsToTransactionsModule, "updateLoggedTransactions")
        .mockImplementation(log => ({
          type: ACTIONS.UPDATE_LOGGED_TRANSACTIONS,
          data: {
            log
          }
        }));
      loadReportingWindowBoundsSpy = jest
        .spyOn(loadReportingWindowBoundsModule, "loadReportingWindowBounds")
        .mockImplementation(() => ({
          type: ACTIONS.LOAD_REPORTING_WINDOW
        }));
      getWinningBalanceSpy = jest
        .spyOn(getWinningBalanceModule, "getWinningBalance")
        .mockImplementation(marketIds => ({
          type: ACTIONS.GET_WINNING_BALANCE,
          data: {
            marketIds
          }
        }));
      loadMarketOpenOrdersSpy = jest
        .spyOn(loadMarketOpenOrdersModule, "loadMarketOpenOrders")
        .mockImplementation(options => ({
          type: ACTIONS.LOAD_MARKET_OPEN_ORDERS,
          data: {
            marketId: options.marketId
          }
        }));
      loadAccountPositions = jest
        .spyOn(loadAccountPositionsModule, "loadAccountPositions")
        .mockImplementation(() => ({
          type: ACTIONS.LOAD_ACCOUNT_POSITIONS
        }));
      updateAssetsSpy = jest
        .spyOn(updateAssetsModule, "updateAssets")
        .mockImplementation(() => ({
          type: "UPDATE_ASSETS"
        }));
    });

    afterAll(() => {
      isCurrentMarketSpy.mockReset();
      updateLoggedTransactionsSpy.mockReset();
      loadReportingWindowBoundsSpy.mockReset();
      loadAccountTradesSpy.mockReset();
      getWinningBalanceSpy.mockReset();
      loadMarketOpenOrdersSpy.mockReset();
      loadAccountPositions.mockReset();
      updateAssetsSpy.mockReset();
    });

    test("Fired off update and load account trades if the sell complete set log includes the account address.", () => {
      isCurrentMarketSpy = jest
        .spyOn(isCurrentMarketModule, "isCurrentMarket")
        .mockImplementation(() => false);
      const state = {
        loginAccount: {
          address: "0xb0b"
        }
      };
      store = configureMockStore([thunk])({
        ...state
      });
      const log = {
        marketId: "0xdeadbeef",
        account: "0xb0b"
      };
      store.dispatch(handleCompleteSetsSoldLog(log));
      expect(store.getActions()).toEqual([
        {
          type: ACTIONS.UPDATE_ASSETS
        },
        {
          type: ACTIONS.UPDATE_LOGGED_TRANSACTIONS,
          data: {
            log
          }
        },
        {
          type: ACTIONS.LOAD_ACCOUNT_POSITIONS
        }
      ]);
    });

    test("Didn't fire off update and load account trades if the sell complete set log doesn't include the account address.", () => {
      isCurrentMarketSpy = jest
        .spyOn(isCurrentMarketModule, "isCurrentMarket")
        .mockImplementation(() => false);
      store = configureMockStore([thunk])({
        ...{
          loginAccount: {
            address: "0xb0b"
          }
        }
      });
      const log = {
        marketId: "0xdeadbeef",
        account: "0xa11ce"
      };
      store.dispatch(handleCompleteSetsSoldLog(log));
      expect(store.getActions()).toHaveLength(0);
    });

    test("Processed token mint log", () => {
      isCurrentMarketSpy = jest
        .spyOn(isCurrentMarketModule, "isCurrentMarket")
        .mockImplementation(() => false);
      store = configureMockStore([thunk])({
        ...{
          loginAccount: {
            address: "0xb0b"
          }
        }
      });
      const log = {
        marketId: "0xdeadbeef",
        target: "0xb0b"
      };
      store.dispatch(handleTokensMintedLog(log));
      expect(store.getActions()).toEqual([
        { type: ACTIONS.UPDATE_ASSETS },
        { type: ACTIONS.LOAD_REPORTING_WINDOW }
      ]);
    });

    test("Processed token mint log when address does not match.", () => {
      isCurrentMarketSpy = jest
        .spyOn(isCurrentMarketModule, "isCurrentMarket")
        .mockImplementation(() => false);
      store = configureMockStore([thunk])({
        ...{
          loginAccount: {
            address: "0xb0b111"
          }
        }
      });
      const log = {
        marketId: "0xdeadbeef",
        target: "0xb0b"
      };
      store.dispatch(handleTokensMintedLog(log));
      expect(store.getActions()).toHaveLength(0);
    });

    test("Processed trading proceeds claimed log", () => {
      isCurrentMarketSpy = jest
        .spyOn(isCurrentMarketModule, "isCurrentMarket")
        .mockImplementation(() => false);
      store = configureMockStore([thunk])({
        ...{
          loginAccount: {
            address: "0xb0b"
          },
          marketsData: {
            "0xdeadbeef": {}
          }
        }
      });
      const log = {
        market: "0xdeadbeef",
        sender: "0xb0b"
      };
      store.dispatch(handleTradingProceedsClaimedLog(log));
      expect(store.getActions()).toEqual([
        {
          type: ACTIONS.UPDATE_ASSETS
        },
        {
          type: ACTIONS.UPDATE_LOGGED_TRANSACTIONS,
          data: {
            log
          }
        },
        {
          type: ACTIONS.LOAD_ACCOUNT_POSITIONS
        }
      ]);
    });

    test("Process trading proceeds claimed log when address does not match", () => {
      isCurrentMarketSpy = jest
        .spyOn(isCurrentMarketModule, "isCurrentMarket")
        .mockImplementation(() => false);
      store = configureMockStore([thunk])({
        ...{
          loginAccount: {
            address: "0xb0b11"
          },
          marketsData: {
            "0xdeadbeef": {}
          }
        }
      });
      const log = {
        market: "0xdeadbeef",
        sender: "0xb0b"
      };
      store.dispatch(handleTradingProceedsClaimedLog(log));
      expect(store.getActions()).toHaveLength(0);
    });
  });
});
