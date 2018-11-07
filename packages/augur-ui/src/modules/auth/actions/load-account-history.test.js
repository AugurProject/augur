import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { loadAccountHistory } from "modules/auth/actions/load-account-history";
import { loadAccountTrades } from "modules/positions/actions/load-account-trades";
import { loadFundingHistory } from "modules/account/actions/load-funding-history";
import { loadCreateMarketHistory } from "modules/markets/actions/load-create-market-history";
import { loadReportingHistory } from "modules/reports/actions/load-reporting-history";
import { loadAccountCompleteSets } from "modules/positions/actions/load-account-complete-sets";

jest.mock("modules/positions/actions/load-account-trades");
jest.mock("modules/account/actions/load-funding-history");
jest.mock("modules/markets/actions/load-create-market-history");
jest.mock("modules/reports/actions/load-reporting-history");
jest.mock("modules/positions/actions/load-account-complete-sets");

describe(`modules/auth/actions/load-account-history.js`, () => {
  const mockStore = configureMockStore([thunk]);
  let store;
  const ACTIONS = {
    LOAD_ACCOUNT_TRADES: "LOAD_ACCOUNT_TRADES",
    LOAD_FUNDING_HISTORY: "LOAD_FUNDING_HISTORY",
    LOAD_CREATE_MARKET_HISTORY: "LOAD_CREATE_MARKET_HISTORY",
    LOAD_REPORTING_HISTORY: "LOAD_REPORTING_HISTORY",
    UPDATE_APP_STATUS: "UPDATE_APP_STATUS",
    CLEAR_TRANSACTION_DATA: "CLEAR_TRANSACTION_DATA",
    LOAD_COMPLETE_SETS: "LOAD_COMPLETE_SETS"
  };
  const TRANSACTIONS_LOADING = "transactionsLoading";

  beforeEach(() => {
    loadAccountTrades.mockImplementation(() => ({
      type: ACTIONS.LOAD_ACCOUNT_TRADES
    }));

    loadFundingHistory.mockImplementation(() => ({
      type: ACTIONS.LOAD_FUNDING_HISTORY
    }));

    loadCreateMarketHistory.mockImplementation(() => ({
      type: ACTIONS.LOAD_CREATE_MARKET_HISTORY
    }));

    loadReportingHistory.mockImplementation(() => ({
      type: ACTIONS.LOAD_REPORTING_HISTORY
    }));
    loadAccountCompleteSets.mockImplementation(() => ({
      type: ACTIONS.LOAD_COMPLETE_SETS
    }));

    store = mockStore({
      loginAccount: {
        address: "0xb0b"
      }
    });
  });

  test("get actions for running through", () => {
    store.dispatch(loadAccountHistory(123456, 234567));
    const actual = store.getActions();
    const expected = [
      {
        data: {
          statusKey: TRANSACTIONS_LOADING,
          value: true
        },
        type: ACTIONS.UPDATE_APP_STATUS
      },
      {
        type: ACTIONS.CLEAR_TRANSACTION_DATA
      },
      {
        type: ACTIONS.LOAD_ACCOUNT_TRADES
      },
      {
        type: ACTIONS.LOAD_COMPLETE_SETS
      },
      {
        type: ACTIONS.LOAD_FUNDING_HISTORY
      },
      {
        type: ACTIONS.LOAD_CREATE_MARKET_HISTORY
      },
      {
        type: ACTIONS.LOAD_REPORTING_HISTORY
      }
    ];

    expect(actual).toEqual(expected);
  });
});
