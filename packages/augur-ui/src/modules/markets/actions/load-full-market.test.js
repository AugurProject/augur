import thunk from "redux-thunk";
import { isObject, omit, isEmpty, isNull } from "lodash";
import { MARKET_FULLY_LOADING } from "modules/markets/constants/market-loading-states";
import { UPDATE_MARKET_LOADING } from "modules/markets/actions/update-market-loading";

const create = state => {
  let actions = [];
  const next = jest.fn();
  const getActions = () => actions;
  const store = {
    getState: jest.fn(() => state),
    dispatch: jest.fn(value => {
      if (isObject(value)) {
        const items = omit(value, () => {});
        if (items && !isNull(items) && !isEmpty(items)) {
          actions = [...actions, items];
        }
      }
    }),
    getActions
  };

  return {
    store,
    next,
    invoke: action => thunk(store)(next)(action),
    getActions
  };
};

describe("loadFullMarket no market data in state", () => {
  test(`should dispatch the expected actions when basic market data IS NOT loaded and info loads WITHOUT errors`, () => {
    const { invoke, store } = create({ marketsData: {} });
    const { loadFullMarket } = require("./load-full-market");

    invoke(loadFullMarket("0xMARKETID"), () => {});
    const actual = store.getActions();

    const expected = [
      {
        data: {
          marketLoadingState: {
            "0xMARKETID": MARKET_FULLY_LOADING
          }
        },
        type: UPDATE_MARKET_LOADING
      }
    ];

    expect(actual).toEqual(expected);
  });

  test(`should dispatch the expected actions when basic market data IS NOT loaded and info loads WITHOUT errors`, () => {
    const { invoke, store } = create({
      marketsData: { "0xMARKETID": { bob: "bob" } }
    });
    const { loadFullMarket } = require("./load-full-market");

    invoke(loadFullMarket("0xMARKETID"), () => {});
    const actual = store.getActions();

    const expected = [
      {
        data: {
          marketLoadingState: {
            "0xMARKETID": MARKET_FULLY_LOADING
          }
        },
        type: UPDATE_MARKET_LOADING
      }
    ];

    expect(actual).toEqual(expected);
  });
});
