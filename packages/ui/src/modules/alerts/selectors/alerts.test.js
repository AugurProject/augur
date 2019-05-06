import {
  selectAlertsByLevel,
  selectInfoAlertsAndSeenCount
} from "modules/alerts/selectors/alerts";
import * as alertLevels from "src/modules/common-elements/constants";

describe("modules/alerts/selectors/alerts", () => {
  let state;

  describe("selectInfoAlertsAndSeenCount", () => {
    beforeEach(() => {
      state = {
        alerts: [
          {
            seen: false,
            id: "0xTEST0",
            level: alertLevels.INFO,
            timestamp: 1
          },
          {
            seen: true,
            id: "0xTEST1",
            level: alertLevels.INFO,
            timestamp: 3
          },
          {
            seen: false,
            id: "0xTEST2",
            level: alertLevels.INFO,
            timestamp: 2
          }
        ]
      };
    });

    test("returned the expected object", () => {
      expect(selectInfoAlertsAndSeenCount(state)).toEqual({
        unseenCount: 2,
        alerts: [
          {
            seen: true,
            id: "0xTEST1",
            level: alertLevels.INFO,
            timestamp: 3,
            index: 1
          },
          {
            seen: false,
            id: "0xTEST2",
            level: alertLevels.INFO,
            timestamp: 2,
            index: 2
          },
          {
            seen: false,
            id: "0xTEST0",
            level: alertLevels.INFO,
            timestamp: 1,
            index: 0
          }
        ]
      });
    });
  });

  describe("selectAlertsByLevel", () => {
    beforeEach(() => {
      state = {
        alerts: [
          {
            id: "0xTEST0",
            level: alertLevels.INFO
          },
          {
            id: "0xTEST1",
            level: alertLevels.INFO
          },
          {
            id: "0xTEST2",
            level: alertLevels.CRITICAL
          }
        ]
      };
    });

    test("returned alerts with a matching level", () => {
      const actual = selectAlertsByLevel(alertLevels.INFO)(state);
      expect(actual).toHaveLength(2);
    });
  });
});
