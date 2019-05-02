import * as updateAlerts from "modules/alerts/actions/alerts";
import * as alertLevels from "modules/common-elements/constants";
import thunk from "redux-thunk";
import testState from "test/testState";
import configureMockStore from "redux-mock-store";

describe("modules/alerts/actions/alerts", () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const state = Object.assign({}, testState);
  const store = mockStore(state);

  describe("addAlert", () => {
    test("returned nothing when the alerts param is null/undefined", () => {
      expect(store.dispatch(updateAlerts.addAlert())).toBeUndefined();
    });

    test("returned the expected object when a alert is passed in", () => {
      const actual = store.dispatch(updateAlerts.addAlert({}));

      expect(actual).toEqual({
        type: updateAlerts.ADD_ALERT,
        data: {
          alert: {
            level: alertLevels.INFO,
            networkId: null,
            seen: false,
            universe: undefined
          }
        }
      });
    });

    test("alert level defaulted to the 'INFO' constant", () => {
      const actual = store.dispatch(updateAlerts.addAlert({})).data.alert.level;

      expect(actual).toBe(alertLevels.INFO);
    });

    test("overrode the default alert level with the value passed in the alert object param", () => {
      const actual = store.dispatch(
        updateAlerts.addAlert({
          level: alertLevels.CRITICAL
        })
      ).data.alert.level;

      expect(actual).toBe(alertLevels.CRITICAL);
    });
  });

  describe("removeAlert", () => {
    test("returned the expected object", () => {
      const actual = store.dispatch(updateAlerts.removeAlert(1));

      expect(actual).toEqual({
        type: updateAlerts.REMOVE_ALERT,
        data: { id: 1 }
      });
    });
  });

  describe("updateAlert", () => {
    test("returned the expected object", () => {
      const actual = store.dispatch(
        updateAlerts.updateAlert(1, {
          testing: "test_update"
        })
      );

      expect(actual).toEqual({
        type: updateAlerts.UPDATE_ALERT,
        data: {
          id: 1,
          alert: {
            testing: "test_update"
          }
        }
      });
    });
  });

  describe("clearAlerts", () => {
    test("returned the expected object", () => {
      const actual = store.dispatch(updateAlerts.clearAlerts());

      expect(actual).toEqual({
        type: updateAlerts.CLEAR_ALERTS,
        data: {
          level: alertLevels.INFO
        }
      });
    });

    describe("alertLevel", () => {
      test("returned the 'INFO' constant", () => {
        const actual = store.dispatch(updateAlerts.clearAlerts()).data.level;

        expect(actual).toBe(alertLevels.INFO);
      });

      test("passed alertLevel", () => {
        const actual = updateAlerts.clearAlerts(alertLevels.CRITICAL).data
          .level;

        expect(actual).toBe(alertLevels.CRITICAL);
      });
    });
  });
});
