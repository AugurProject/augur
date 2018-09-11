import {
  IS_ANIMATING,
  IS_MOBILE,
  IS_MOBILE_SMALL,
  HAS_LOADED_MARKETS,
  TRANSACTIONS_LOADING,
  UPDATE_APP_STATUS,
  updateAppStatus
} from "modules/app/actions/update-app-status";

describe("modules/app/actions/update-app-status.js", () => {
  const test = t => {
    it(t.description, () => {
      t.assertions(updateAppStatus(t.statusKey, t.value));
    });
  };

  test({
    description: "should return the expected object for updating isAnimating",
    statusKey: IS_ANIMATING,
    value: true,
    assertions: action => {
      const expected = {
        type: UPDATE_APP_STATUS,
        data: {
          statusKey: IS_ANIMATING,
          value: true
        }
      };

      assert.deepEqual(action, expected, `Didn't return the expected object`);
    }
  });

  test({
    description: "should return the expected object for updating isMobile",
    statusKey: IS_MOBILE,
    value: true,
    assertions: action => {
      const expected = {
        type: UPDATE_APP_STATUS,
        data: {
          statusKey: IS_MOBILE,
          value: true
        }
      };

      assert.deepEqual(action, expected, `Didn't return the expected object`);
    }
  });

  test({
    description: "should return the expected object for updating isMobileSmall",
    statusKey: IS_MOBILE_SMALL,
    value: true,
    assertions: action => {
      const expected = {
        type: UPDATE_APP_STATUS,
        data: {
          statusKey: IS_MOBILE_SMALL,
          value: true
        }
      };

      assert.deepEqual(action, expected, `Didn't return the expected object`);
    }
  });

  test({
    description:
      "should return the expected object for updating hasLoadedMarkets",
    statusKey: HAS_LOADED_MARKETS,
    value: true,
    assertions: action => {
      const expected = {
        type: UPDATE_APP_STATUS,
        data: {
          statusKey: HAS_LOADED_MARKETS,
          value: true
        }
      };

      assert.deepEqual(action, expected, `Didn't return the expected object`);
    }
  });

  test({
    description:
      "should return the expected object for updating transactionsLoading",
    statusKey: TRANSACTIONS_LOADING,
    value: true,
    assertions: action => {
      const expected = {
        type: UPDATE_APP_STATUS,
        data: {
          statusKey: TRANSACTIONS_LOADING,
          value: true
        }
      };

      assert.deepEqual(action, expected, `Didn't return the expected object`);
    }
  });
});
