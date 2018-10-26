import {
  IS_ANIMATING,
  IS_MOBILE,
  IS_MOBILE_SMALL,
  TRANSACTIONS_LOADING,
  HAS_LOADED_MARKETS,
  UPDATE_APP_STATUS
} from "modules/app/actions/update-app-status";

const DEFAULT_STATE = {
  [IS_ANIMATING]: false,
  [IS_MOBILE]: false,
  [IS_MOBILE_SMALL]: false,
  [HAS_LOADED_MARKETS]: false,
  [TRANSACTIONS_LOADING]: false
};

describe("modules/app/reducers/update-app-status.js", () => {
  const appStatus = require("modules/app/reducers/app-status").default;

  test("should return the default value", () => {
    const actual = appStatus(DEFAULT_STATE, { type: undefined });
    const expected = DEFAULT_STATE;
    expect(actual).toEqual(expected);
  });

  test("should return the existing value", () => {
    const actual = appStatus(DEFAULT_STATE, { type: null });
    const expected = DEFAULT_STATE;
    expect(actual).toEqual(expected);
  });

  test("should return the updated value for has loaded markets", () => {
    const actual = appStatus(DEFAULT_STATE, {
      type: UPDATE_APP_STATUS,
      data: {
        statusKey: HAS_LOADED_MARKETS,
        value: true
      }
    });
    const expected = {
      ...DEFAULT_STATE,
      [HAS_LOADED_MARKETS]: true
    };
    expect(actual).toEqual(expected);
  });

  test("should return the updated value for is animating", () => {
    const actual = appStatus(DEFAULT_STATE, {
      type: UPDATE_APP_STATUS,
      data: {
        statusKey: IS_ANIMATING,
        value: true
      }
    });

    const expected = {
      ...DEFAULT_STATE,
      [IS_ANIMATING]: true
    };
    expect(actual).toEqual(expected);
  });

  test("should return the updated value for is mobile", () => {
    const actual = appStatus(DEFAULT_STATE, {
      type: UPDATE_APP_STATUS,
      data: {
        statusKey: IS_MOBILE,
        value: true
      }
    });

    const expected = {
      ...DEFAULT_STATE,
      [IS_MOBILE]: true
    };
    expect(actual).toEqual(expected);
  });

  test("should return the updated value for is mobile small", () => {
    const actual = appStatus(DEFAULT_STATE, {
      type: UPDATE_APP_STATUS,
      data: {
        statusKey: IS_MOBILE_SMALL,
        value: true
      }
    });

    const expected = {
      ...DEFAULT_STATE,
      [IS_MOBILE_SMALL]: true
    };
    expect(actual).toEqual(expected);
  });

  test("should return the updated value for transactions loading", () => {
    const actual = appStatus(DEFAULT_STATE, {
      type: UPDATE_APP_STATUS,
      data: {
        statusKey: TRANSACTIONS_LOADING,
        value: true
      }
    });

    const expected = {
      ...DEFAULT_STATE,
      [TRANSACTIONS_LOADING]: true
    };
    expect(actual).toEqual(expected);
  });
});
