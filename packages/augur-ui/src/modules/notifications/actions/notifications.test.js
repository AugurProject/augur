import * as updateNotifications from "modules/notifications/actions/notifications";
import * as notificationLevels from "modules/notifications/constants/notifications";
import thunk from "redux-thunk";
import testState from "test/testState";
import configureMockStore from "redux-mock-store";

describe("modules/notifications/actions/notifications", () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const state = Object.assign({}, testState);
  const store = mockStore(state);

  describe("addNotification", () => {
    test("if returns nothing when the notifications param is null/undefined", () => {
      expect(
        store.dispatch(updateNotifications.addNotification())
      ).toBeUndefined();
    });

    test("if returns the expected object when a notification is passed in", () => {
      const actual = store.dispatch(updateNotifications.addNotification({}));

      expect(actual).toEqual({
        type: updateNotifications.ADD_NOTIFICATION,
        data: {
          notification: {
            level: notificationLevels.INFO,
            networkId: null,
            seen: false,
            universe: undefined
          }
        }
      });
    });

    test("if the notification level defaults to the 'INFO' constant", () => {
      const actual = store.dispatch(updateNotifications.addNotification({}))
        .data.notification.level;

      expect(actual).toBe(notificationLevels.INFO);
    });

    test("if overrides the default notification level with the value passed in the notification object param", () => {
      const actual = store.dispatch(
        updateNotifications.addNotification({
          level: notificationLevels.CRITICAL
        })
      ).data.notification.level;

      expect(actual).toBe(notificationLevels.CRITICAL);
    });
  });

  describe("removeNotification", () => {
    test("if returns the expected object", () => {
      const actual = store.dispatch(updateNotifications.removeNotification(1));

      expect(actual).toEqual({
        type: updateNotifications.REMOVE_NOTIFICATION,
        data: { id: 1 }
      });
    });
  });

  describe("updateNotification", () => {
    test("if returns the expected object", () => {
      const actual = store.dispatch(
        updateNotifications.updateNotification(1, {
          testing: "test_update"
        })
      );

      expect(actual).toEqual({
        type: updateNotifications.UPDATE_NOTIFICATION,
        data: {
          id: 1,
          notification: {
            testing: "test_update"
          }
        }
      });
    });
  });

  describe("clearNotifications", () => {
    test("if returns the expected object", () => {
      const actual = store.dispatch(updateNotifications.clearNotifications());

      expect(actual).toEqual({
        type: updateNotifications.CLEAR_NOTIFICATIONS,
        data: {
          level: notificationLevels.INFO
        }
      });
    });

    describe("notificationLevel", () => {
      test("the 'INFO' constant", () => {
        const actual = store.dispatch(updateNotifications.clearNotifications())
          .data.level;

        expect(actual).toBe(notificationLevels.INFO);
      });

      test("if passes notificationLevel", () => {
        const actual = updateNotifications.clearNotifications(
          notificationLevels.CRITICAL
        ).data.level;

        expect(actual).toBe(notificationLevels.CRITICAL);
      });
    });
  });
});
