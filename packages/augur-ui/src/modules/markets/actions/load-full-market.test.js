import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { MARKET_FULLY_LOADING } from "modules/markets/constants/market-loading-states";
import { UPDATE_MARKET_LOADING } from "modules/markets/actions/update-market-loading";

jest.mock("modules/markets/actions/load-markets-info");
jest.mock("modules/orders/actions/load-bids-asks");
jest.mock("modules/positions/actions/load-account-trades");
jest.mock("modules/markets/actions/price-history-management");
jest.mock("modules/markets/actions/market-trading-history-management");

describe("loadFullMarket no market data in state", () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  test(`should dispatch load markets info`, () => {
    const store = mockStore({ marketsData: {} });
    const { loadFullMarket } = require("./load-full-market");
    const marketId = "0xMARKETID";
    store.dispatch(loadFullMarket(marketId));
    const actual = store.getActions();
    const expected = [
      {
        data: {
          marketLoadingState: {
            marketId: MARKET_FULLY_LOADING
          }
        }
      },
      {
        type: "LOAD_MARKETS_INFO",
        value: [marketId]
      }
    ];

    expect(actual).toEqual(expected);
  });

  test(`should dispatch empty marketId`, () => {
    const marketId = "0xMARKETID";
    const store = mockStore({
      marketsData: {
        marketId: {
          prop: "value"
        }
      }
    });
    const { loadFullMarket } = require("./load-full-market");

    store.dispatch(loadFullMarket());
    const actual = store.getActions();

    const expected = [
      {
        data: {
          marketLoadingState: {
            marketId: MARKET_FULLY_LOADING
          }
        },
        type: UPDATE_MARKET_LOADING
      },
      {
        type: "LOAD_MARKETS_INFO",
        value: [marketId]
      }
    ];

    expect(actual).toEqual(expected);
  });
});
