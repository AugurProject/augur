import {
  selectNotificationsByLevel,
  selectInfoNotificationsAndSeenCount
} from "modules/notifications/selectors/notifications";
import * as notificationLevels from "src/modules/notifications/constants";

describe("modules/notifications/selectors/notifications", () => {
  let state;

  describe("selectInfoNotificationsAndSeenCount", () => {
    beforeEach(() => {
      state = {
        notifications: [
          {
            seen: false,
            id: "0xTEST0",
            level: notificationLevels.INFO,
            timestamp: 1
          },
          {
            seen: true,
            id: "0xTEST1",
            level: notificationLevels.INFO,
            timestamp: 3
          },
          {
            seen: false,
            id: "0xTEST2",
            level: notificationLevels.INFO,
            timestamp: 2
          }
        ]
      };
    });

    it("should return the expected object", () => {
      const actual = selectInfoNotificationsAndSeenCount(state);
      const expected = {
        unseenCount: 2,
        notifications: [
          {
            seen: true,
            id: "0xTEST1",
            level: notificationLevels.INFO,
            timestamp: 3,
            index: 1
          },
          {
            seen: false,
            id: "0xTEST2",
            level: notificationLevels.INFO,
            timestamp: 2,
            index: 2
          },
          {
            seen: false,
            id: "0xTEST0",
            level: notificationLevels.INFO,
            timestamp: 1,
            index: 0
          }
        ]
      };

      assert.deepEqual(actual, expected, `Didn't return the expected object`);
    });
  });

  describe("selectNotificationsByLevel", () => {
    beforeEach(() => {
      state = {
        notifications: [
          {
            id: "0xTEST0",
            level: notificationLevels.INFO
          },
          {
            id: "0xTEST1",
            level: notificationLevels.INFO
          },
          {
            id: "0xTEST2",
            level: notificationLevels.CRITICAL
          }
        ]
      };
    });

    it("should only return notifications with a matching level", () => {
      const actual = selectNotificationsByLevel(notificationLevels.INFO)(state);
      assert.lengthOf(actual, 2);
    });
  });
});
