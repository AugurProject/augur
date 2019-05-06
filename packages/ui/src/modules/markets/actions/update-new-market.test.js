import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";

import {
  invalidateMarketCreation,
  addOrderToNewMarket,
  removeOrderFromNewMarket,
  updateNewMarket,
  clearNewMarket,
  ADD_ORDER_TO_NEW_MARKET,
  REMOVE_ORDER_FROM_NEW_MARKET,
  UPDATE_NEW_MARKET,
  CLEAR_NEW_MARKET
} from "modules/markets/actions/update-new-market";

describe("modules/markets/actions/update-new-market.js", () => {
  test(`should dispatch the expected actions from 'invalidateMarketCreation'`, () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    const store = mockStore();

    store.dispatch(invalidateMarketCreation("testing"));

    const actions = store.getActions();

    const expected = [
      {
        type: UPDATE_NEW_MARKET,
        data: {
          newMarketData: { isValid: false }
        }
      }
    ];

    expect(actions).toEqual(expected);
  });

  test(`should return the expected object for 'addOrderToNewMarket'`, () => {
    const actions = addOrderToNewMarket({ test: "test" });

    const expected = {
      type: ADD_ORDER_TO_NEW_MARKET,
      data: {
        order: { test: "test" }
      }
    };

    expect(actions).toEqual(expected);
  });

  test(`should return the expected object for 'removeOrderFromNewMarket'`, () => {
    const actions = removeOrderFromNewMarket({ test: "test" });

    const expected = {
      type: REMOVE_ORDER_FROM_NEW_MARKET,
      data: {
        order: { test: "test" }
      }
    };

    expect(actions).toEqual(expected);
  });

  test(`should return the expected object for 'updateNewMarket'`, () => {
    const actions = updateNewMarket({ test: "test" });

    const expected = {
      type: UPDATE_NEW_MARKET,
      data: {
        newMarketData: { test: "test" }
      }
    };

    expect(actions).toEqual(expected);
  });

  test(`should return the expected object for 'clearNewMarket'`, () => {
    const actions = clearNewMarket();

    const expected = {
      type: CLEAR_NEW_MARKET
    };

    expect(actions).toEqual(expected);
  });
});
