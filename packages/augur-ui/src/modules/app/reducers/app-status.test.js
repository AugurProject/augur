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
  const t1 = {
    description: "Returns the default value",
    assertions: () => {
      const actual = appStatus(DEFAULT_STATE, { type: undefined });

      expect(actual).toBe(DEFAULT_STATE);
    }
  };

  const t2 = {
    description: "Returns the existing value",
    assertions: () => {
      const actual = appStatus(DEFAULT_STATE, { type: null });

      expect(actual).toBe(DEFAULT_STATE);
    }
  };

  const t3 = {
    description: "Returns the updated value for has loaded markets",
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
      expect(actual).toEqual(expected);
    }
  };

  const t4 = {
    description: "Returns the updated value for is animating",
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
      expect(actual).toEqual(expected);
    }
  };

  const t5 = {
    description: "Returns the updated value for is mobile",
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
      expect(actual).toEqual(expected);
    }
  };

  const t6 = {
    description: "Returns the updated value for is mobile small",
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
      expect(actual).toEqual(expected);
    }
  };

  const t7 = {
    description: "Returns the updated value for transactions loading",
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
      expect(actual).toEqual(expected);
    }
  };

  describe.each([t1, t2, t3, t4 ,t5, t6, t7])("App status test", t => {
    test(t.description, () => {
      t.assertions();
    })
  });
});
