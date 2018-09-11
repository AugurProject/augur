import appStatus from "modules/app/reducers/app-status";

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
  const test = t => {
    it(t.describe, () => {
      t.assertions();
    });
  };

  test({
    describe: "should return the default value",
    assertions: () => {
      const actual = appStatus(DEFAULT_STATE, { type: undefined });

      const expected = DEFAULT_STATE;

      assert.equal(
        actual,
        expected,
        `Didn't return the expected default value`
      );
    }
  });

  test({
    describe: "should return the existing value",
    assertions: () => {
      const actual = appStatus(DEFAULT_STATE, { type: null });

      const expected = DEFAULT_STATE;

      assert.equal(
        actual,
        expected,
        `Didn't return the expected existing value`
      );
    }
  });

  test({
    describe: "should return the updated value for has loaded markets",
    assertions: () => {
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
      assert.deepEqual(
        actual,
        expected,
        `Didn't return the expected updated value`
      );
    }
  });

  test({
    describe: "should return the updated value for is animating",
    assertions: () => {
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
      assert.deepEqual(
        actual,
        expected,
        `Didn't return the expected updated value`
      );
    }
  });

  test({
    describe: "should return the updated value for is mobile",
    assertions: () => {
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
      assert.deepEqual(
        actual,
        expected,
        `Didn't return the expected updated value`
      );
    }
  });

  test({
    describe: "should return the updated value for is mobile small",
    assertions: () => {
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
      assert.deepEqual(
        actual,
        expected,
        `Didn't return the expected updated value`
      );
    }
  });

  test({
    describe: "should return the updated value for transactions loading",
    assertions: () => {
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
      assert.deepEqual(
        actual,
        expected,
        `Didn't return the expected updated value`
      );
    }
  });
});
