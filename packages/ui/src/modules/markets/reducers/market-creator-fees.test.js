import { UPDATE_MARKET_CREATOR_FEES } from "modules/markets/actions/market-creator-fees-management";
import reducer from "modules/markets/reducers/market-creator-fees";

describe("modules/markets/reducers/market-creator-fees.js", () => {
  let state;
  let expected;

  const action = {
    type: UPDATE_MARKET_CREATOR_FEES,
    data: null
  };

  test("should return the default parameter state", () => {
    expect(reducer(undefined, { type: null, data: null })).toEqual({});
  });

  test("should return an object with a first update", () => {
    action.data = {
      marketCreatorFees: { "0xtest1": "a big num" }
    };

    expected = { "0xtest1": "a big num" };

    expect(reducer(state, action)).toEqual(expected);
  });

  test("should return an object with a second update", () => {
    state = action.data;

    action.data = {
      marketCreatorFees: { "0xtest2": "a big num" }
    };

    expected = {
      ...state,
      "0xtest2": "a big num"
    };

    expect(reducer(state, action)).toEqual(expected);
  });

  test("should return an object with an updated value", () => {
    state = expected;

    action.data = {
      marketCreatorFees: { "0xtest1": "a different big num" }
    };

    expected = {
      ...state,
      "0xtest1": "a different big num"
    };

    expect(reducer(state, action)).toEqual(expected);
  });
});
