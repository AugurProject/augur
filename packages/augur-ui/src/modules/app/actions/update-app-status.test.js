import {
  IS_ANIMATING,
  IS_MOBILE,
  IS_MOBILE_SMALL,
  TRANSACTIONS_LOADING,
  UPDATE_APP_STATUS,
  updateAppStatus
} from "modules/app/actions/update-app-status";

describe("modules/app/actions/update-app-status.js", () => {
  const t1 = {
    description: "Returns the expected object for updating isAnimating",
    statusKey: IS_ANIMATING,
    value: true,
    assertions: action => {
      expect(action).toEqual({
        type: UPDATE_APP_STATUS,
        data: {
          statusKey: IS_ANIMATING,
          value: true
        }
      });
    }
  };

  const t2 = {
    description: "Returns the expected object for updating isMobile",
    statusKey: IS_MOBILE,
    value: true,
    assertions: action => {
      expect(action).toEqual({
        type: UPDATE_APP_STATUS,
        data: {
          statusKey: IS_MOBILE,
          value: true
        }
      });
    }
  };

  const t3 = {
    description: "Returns the expected object for updating isMobileSmall",
    statusKey: IS_MOBILE_SMALL,
    value: true,
    assertions: action => {
      expect(action).toEqual({
        type: UPDATE_APP_STATUS,
        data: {
          statusKey: IS_MOBILE_SMALL,
          value: true
        }
      });
    }
  };

  const t4 = {
    description: "Returns the expected object for updating transactionsLoading",
    statusKey: TRANSACTIONS_LOADING,
    value: true,
    assertions: action => {
      expect(action).toEqual({
        type: UPDATE_APP_STATUS,
        data: {
          statusKey: TRANSACTIONS_LOADING,
          value: true
        }
      });
    }
  };

  describe.each([t1, t2, t3, t4])("Update app status tests", t => {
    test(t.description, () => {
      t.assertions(updateAppStatus(t.statusKey, t.value));
    });
  });
});
