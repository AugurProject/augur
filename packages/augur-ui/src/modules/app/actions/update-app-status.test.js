import {
  IS_MOBILE,
  IS_MOBILE_SMALL,
  UPDATE_APP_STATUS,
  updateAppStatus
} from "modules/app/actions/update-app-status";

describe("modules/app/actions/update-app-status.js", () => {
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

  describe.each([t2, t3])("Update app status tests", t => {
    test(t.description, () => {
      t.assertions(updateAppStatus(t.statusKey, t.value));
    });
  });
});
