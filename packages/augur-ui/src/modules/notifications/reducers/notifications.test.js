import * as notificationLevels from "modules/notifications/constants/notifications";

import {
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  UPDATE_NOTIFICATION,
  CLEAR_NOTIFICATIONS
} from "modules/notifications/actions/notifications";

import notifications from "modules/notifications/reducers/notifications";

describe("modules/notifications/reducers/notifications", () => {
  test("returned the default state", () => {
    expect(notifications(undefined, {})).toHaveLength(0);
  });

  test("returned the expected array for type ADD_NOTIFICATION", () => {
    const actual = notifications([], {
      type: ADD_NOTIFICATION,
      data: {
        notification: {
          id: "0xTEST"
        }
      }
    });

    expect(actual).toEqual([
      {
        id: "0xTEST"
      }
    ]);
  });

  test("returned non dup array for type ADD_NOTIFICATION", () => {
    expect(
      notifications(
        [
          {
            id: "0xTEST"
          }
        ],
        {
          type: ADD_NOTIFICATION,
          data: {
            notification: {
              id: "0xTEST"
            }
          }
        }
      )
    ).toEqual([
      {
        id: "0xTEST"
      }
    ]);
  });

  test("returned the expected array for type REMOVE_NOTIFICATION", () => {
    expect(
      notifications(
        [
          {
            id: "0xTEST"
          }
        ],
        {
          type: REMOVE_NOTIFICATION,
          data: { id: "0xTEST" }
        }
      )
    ).toHaveLength(0);
  });

  test("returned the expected array for type UPDATE_NOTIFICATION", () => {
    expect(
      notifications(
        [
          {
            id: "0xTEST0"
          },
          {
            id: "0xTest1",
            seen: true,
            title: "old object"
          }
        ],
        {
          type: UPDATE_NOTIFICATION,
          data: {
            id: "0xTest1",
            notification: {
              seen: false,
              title: "new object"
            }
          }
        }
      )
    ).toEqual([
      {
        id: "0xTEST0"
      },
      {
        id: "0xTest1",
        seen: true,
        title: "new object"
      }
    ]);
  });

  describe("CLEAR_NOTIFICATIONS action", () => {
    test("removed items with the passed notification level.", () => {
      expect(
        notifications(
          [
            {
              id: "0xTEST0",
              level: notificationLevels.INFO
            },
            {
              id: "0xTEST1",
              level: notificationLevels.CRITICAL
            }
          ],
          {
            type: CLEAR_NOTIFICATIONS,
            data: {
              level: notificationLevels.INFO
            }
          }
        )
      ).toEqual([
        {
          id: "0xTEST1",
          level: notificationLevels.CRITICAL
        }
      ]);
    });
  });
});
