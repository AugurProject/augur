import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";

import {
  MARKET_INFO_LOADING,
  MARKET_INFO_LOADED
} from "modules/markets/constants/market-loading-states";
import {
  UPDATE_MARKET_LOADING,
  REMOVE_MARKET_LOADING
} from "modules/markets/actions/update-market-loading";
import { UPDATE_MARKETS_DATA } from "modules/markets/actions/update-markets-data";
import { augur } from "services/augurjs";

jest.mock("modules/markets/actions/market-trading-history-management");
jest.mock("services/augurjs");

describe("modules/markets/actions/load-markets-info.js", () => {
  const middleware = [thunk];
  const mockStore = configureMockStore(middleware);
  const marketIds = ["0xMarket1", "0xMarket2"];
  const store = mockStore({});
  const {
    loadMarketsInfo
  } = require("modules/markets/actions/load-markets-info");

  augur.markets = jest.fn(() => {});
  augur.markets.getMarketsInfo = jest.fn(() => {});
  describe("loadMarketsInfo successful", () => {
    beforeEach(() => {
      store.clearActions();
      augur.markets.getMarketsInfo.mockImplementation((value, cb) =>
        cb(null, [
          { id: "0xMarket1", test: "value" },
          { id: "0xMarket2", test: "value" }
        ])
      );

      test(`should dispatch the expected actions + call 'getMarketsInfo'`, () => {
        store.dispatch(loadMarketsInfo(marketIds));

        const actual = store.getActions();

        const expected = [
          {
            type: "UPDATE_MARKET_LOADING",
            data: {
              "0xMarket1": "MARKET_INFO_LOADING"
            }
          },
          {
            type: "UPDATE_MARKET_LOADING",
            data: {
              "0xMarket2": "MARKET_INFO_LOADING"
            }
          }
        ];
        expect(augur.markets.getMarketsInfo).toHaveBeenCalledTimes(1);
        expect(actual).toEqual(expected);
      });

      test(`should dispatch the expected actions`, () => {
        const store = mockStore({});
        store.dispatch(loadMarketsInfo(marketIds));

        const actual = store.getActions();

        const expected = [
          {
            type: UPDATE_MARKET_LOADING,
            data: {
              "0xMarket1": MARKET_INFO_LOADING
            }
          },
          {
            type: UPDATE_MARKET_LOADING,
            data: {
              "0xMarket2": MARKET_INFO_LOADING
            }
          },
          {
            type: UPDATE_MARKET_LOADING,
            data: {
              "0xMarket1": MARKET_INFO_LOADED
            }
          },
          {
            type: UPDATE_MARKET_LOADING,
            data: {
              "0xMarket2": MARKET_INFO_LOADED
            }
          },
          {
            type: UPDATE_MARKETS_DATA,
            data: {
              marketsData: {
                "0xMarket1": {
                  id: "0xMarket1",
                  test: "value"
                },
                "0xMarket2": {
                  id: "0xMarket2",
                  test: "value"
                }
              }
            }
          }
        ];
        expect(augur.markets.getMarketsInfo).toHaveBeenCalledTimes(1);
        expect(actual).toEqual(expected);
      });
    });
  });

  describe("loadmarketsInfo with errors", () => {
    test(`should dispatch the expected actions + call 'loadingError' due to null return value from 'getMarketsInfo'`, () => {
      augur.markets.getMarketsInfo.mockImplementationOnce((value, cb) => {
        cb("error", []);
      });

      store.dispatch(loadMarketsInfo(marketIds));

      const actual = store.getActions();

      const expected = [
        {
          type: "UPDATE_MARKET_LOADING",
          data: {
            marketLoadingState: {
              "0xMarket1": MARKET_INFO_LOADING
            }
          }
        },
        {
          type: "UPDATE_MARKET_LOADING",
          data: {
            marketLoadingState: {
              "0xMarket2": MARKET_INFO_LOADING
            }
          }
        },
        {
          type: REMOVE_MARKET_LOADING,
          data: {
            marketLoadingState: "0xMarket1"
          }
        },
        {
          type: REMOVE_MARKET_LOADING,
          data: { marketLoadingState: "0xMarket2" }
        }
      ];
      expect(augur.markets.getMarketsInfo).toHaveBeenCalledTimes(1);
      expect(actual).toEqual(expected);
    });
  });

  describe("loadmarketsInfo with malformed data", () => {
    test(`should dispatch the expected actions + call 'loadingError' due to malformed return value from 'getMarketsInfo'`, () => {
      augur.markets.getMarketsInfo.mockImplementationOnce((value, cb) => {
        cb(null, {});
      });
      store.dispatch(loadMarketsInfo(marketIds));

      const actual = store.getActions();

      const expected = [
        {
          type: "UPDATE_MARKET_LOADING",
          data: {
            marketLoadingState: {
              "0xMarket1": "MARKET_INFO_LOADING"
            }
          }
        },
        {
          type: "UPDATE_MARKET_LOADING",
          data: {
            marketLoadingState: {
              "0xMarket2": "MARKET_INFO_LOADING"
            }
          }
        },
        {
          type: REMOVE_MARKET_LOADING,
          data: {
            marketLoadingState: "0xMarket1"
          }
        },
        {
          type: REMOVE_MARKET_LOADING,
          data: {
            marketLoadingState: "0xMarket2"
          }
        },
        {
          type: "UPDATE_MARKET_LOADING",
          data: {
            marketLoadingState: {
              "0xMarket1": "MARKET_INFO_LOADING"
            }
          }
        },
        {
          type: "UPDATE_MARKET_LOADING",
          data: {
            marketLoadingState: {
              "0xMarket2": "MARKET_INFO_LOADING"
            }
          }
        },
        {
          type: REMOVE_MARKET_LOADING,
          data: {
            marketLoadingState: "0xMarket1"
          }
        },
        {
          type: REMOVE_MARKET_LOADING,
          data: { marketLoadingState: "0xMarket2" }
        }
      ];

      expect(augur.markets.getMarketsInfo).toHaveBeenCalledTimes(1);
      expect(actual).toEqual(expected);
    });
  });
});
