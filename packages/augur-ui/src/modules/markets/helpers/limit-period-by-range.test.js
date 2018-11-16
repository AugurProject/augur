import { limitPeriodByRange } from "modules/markets/helpers/limit-period-by-range";

describe("modules/markets/helpers/limit-period-by-range.js", () => {
  let PERIODS;

  beforeEach(() => {
    PERIODS = [
      {
        duration: 60,
        label: "Every minute"
      },
      {
        duration: 3600,
        label: "Hourly"
      }
    ];
  });

  describe("arguments are omitted", () => {
    test("should return the full  period list", () => {
      const result = limitPeriodByRange(PERIODS);
      expect(result).toEqual(PERIODS);
    });
  });

  describe("when passed a range less than a a period's duration", () => {
    test("should return the subset or period with duration less than the passed value", () => {
      const result = limitPeriodByRange(PERIODS, 3000);
      expect(result).toEqual(PERIODS.slice(0, 1));
    });
  });

  describe("when passed a range equal to a period's duration", () => {
    test("should not include the period in the result", () => {
      const result = limitPeriodByRange(PERIODS, 3600);
      expect(result).toEqual(PERIODS.slice(0, 1));
    });
  });

  describe("when passed a range greater than a period's range", () => {
    test("should include the period on the result", () => {
      const result = limitPeriodByRange(PERIODS, 7200);
      expect(result).toEqual(PERIODS);
    });
  });
});
