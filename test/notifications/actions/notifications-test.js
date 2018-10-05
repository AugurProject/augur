import * as updateNotifications from "modules/notifications/actions/notifications";
import * as notificationLevels from "modules/notifications/constants/notifications";
import thunk from "redux-thunk";
import testState from "test/testState";
import configureMockStore from "redux-mock-store";

describe.only("modules/notifications/actions/notifications", () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const state = Object.assign({}, testState);
  const store = mockStore(state);

  describe("addNotification", () => {
    it("should return nothing when the notifications param is null/undefined", () => {
      const actual = store.dispatch(updateNotifications.addNotification());
      const expected = undefined;

      assert.strictEqual(actual, expected, `Didn't return the expected result`);
    });

    it("should return the expected object when a notification is passed in", () => {
      const actual = store.dispatch(updateNotifications.addNotification({}));

      const expected = {
        type: updateNotifications.ADD_NOTIFICATION,
        data: {
          notification: {
            level: notificationLevels.INFO,
            networkId: null,
            seen: false,
            universe: undefined
          }
        }
      };

      assert.deepEqual(actual, expected, `Didn't return the expected result`);
    });

    it("should default notification level to the 'INFO' constant", () => {
      const actual = store.dispatch(updateNotifications.addNotification({}));
      assert.equal(actual.data.notification.level, notificationLevels.INFO);
    });

    it("should override the default notification level with the value passed in the notification object param", () => {
      const actual = store.dispatch(
        updateNotifications.addNotification({
          level: notificationLevels.CRITICAL
        })
      );
      assert.equal(actual.data.notification.level, notificationLevels.CRITICAL);
    });
  });

  describe("removeNotification", () => {
    it("should return the expected object", () => {
      const actual = store.dispatch(updateNotifications.removeNotification(1));

      const expected = {
        type: updateNotifications.REMOVE_NOTIFICATION,
        data: { id: 1 }
      };

      assert.deepEqual(actual, expected, `Didn't return the expected object`);
    });
  });

  describe("updateNotification", () => {
    it("update should should return the expected object", () => {
      const actual = store.dispatch(
        updateNotifications.updateNotification(1, {
          testing: "test_update"
        })
      );

      const expected = {
        type: updateNotifications.UPDATE_NOTIFICATION,
        data: {
          id: 1,
          notification: {
            testing: "test_update"
          }
        }
      };

      console.log("actual results: ", actual);
      assert.deepEqual(
        expected,
        actual,
        `Didn't return the expected updated object`
      );
    });
  });

  describe("clearNotifications", () => {
    it("clear should return the expected object", () => {
      const actual = store.dispatch(updateNotifications.clearNotifications());

      const expected = {
        type: updateNotifications.CLEAR_NOTIFICATIONS,
        data: {
          level: notificationLevels.INFO
        }
      };
      assert.deepEqual(actual, expected, `Didn't return the expected object`);
    });

    describe("notificationLevel", () => {
      it("should default to the 'INFO' constant", () => {
        const actual = store.dispatch(updateNotifications.clearNotifications());
        assert.equal(actual.data.level, notificationLevels.INFO);
      });

      it("should pass notificationLevel", () => {
        const actual = updateNotifications.clearNotifications(
          notificationLevels.CRITICAL
        );
        assert.equal(actual.data.level, notificationLevels.CRITICAL);
      });
    });
  });
});
