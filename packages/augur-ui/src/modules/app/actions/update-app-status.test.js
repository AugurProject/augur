import {
  IS_ANIMATING,
  IS_MOBILE,
  IS_MOBILE_SMALL,
  HAS_LOADED_MARKETS,
  TRANSACTIONS_LOADING,
  UPDATE_APP_STATUS
} from "modules/app/actions/update-app-status";

describe("modules/app/actions/update-app-status.js", () => {
  const { updateAppStatus } = require("modules/app/actions/update-app-status");

  test("should return the expected object for updating isAnimating", () => {
    const statusKey = IS_ANIMATING;
    const value = true;
    const actual = updateAppStatus(statusKey, value);
    const expected = {
      type: UPDATE_APP_STATUS,
      data: {
        statusKey: IS_ANIMATING,
        value: true
      }
    };
    expect(actual).toEqual(expected);
  });

  test("should return the expected object for updating isMobile", () => {
    const statusKey = IS_MOBILE;
    const value = true;
    const actual = updateAppStatus(statusKey, value);
    const expected = {
      type: UPDATE_APP_STATUS,
      data: {
        statusKey: IS_MOBILE,
        value: true
      }
    };
    expect(actual).toEqual(expected);
  });

  test("should return the expected object for updating isMobileSmall", () => {
    const statusKey = IS_MOBILE_SMALL;
    const value = true;
    const actual = updateAppStatus(statusKey, value);
    const expected = {
      type: UPDATE_APP_STATUS,
      data: {
        statusKey: IS_MOBILE_SMALL,
        value: true
      }
    };

    expect(actual).toEqual(expected);
  });

  test("should return the expected object for updating hasLoadedMarkets", () => {
    const statusKey = HAS_LOADED_MARKETS;
    const value = true;
    const actual = updateAppStatus(statusKey, value);
    const expected = {
      type: UPDATE_APP_STATUS,
      data: {
        statusKey: HAS_LOADED_MARKETS,
        value: true
      }
    };

    expect(actual).toEqual(expected);
  });

  test("should return the expected object for updating transactionsLoading", () => {
    const statusKey = TRANSACTIONS_LOADING;
    const value = true;
    const actual = updateAppStatus(statusKey, value);
    const expected = {
      type: UPDATE_APP_STATUS,
      data: {
        statusKey: TRANSACTIONS_LOADING,
        value: true
      }
    };

    expect(actual).toEqual(expected);
  });
});
