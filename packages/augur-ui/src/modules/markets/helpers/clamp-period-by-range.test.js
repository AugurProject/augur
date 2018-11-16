import { clampPeriodByRange } from "modules/markets/helpers/clamp-period-by-range";

describe("src/modules/markets/helpers/clamp-period-by-range.js", () => {
  let PERIODS;

  beforeEach(() => {
    PERIODS = [
      {
        duration: 60,
        label: "Every minute"
      },
      {
        duration: 120,
        label: "Every two minutes"
      },
      {
        duration: 1800,
        label: "Every thirty minutes"
      },
      {
        duration: 3600,
        label: "Hourly"
      },
      {
        duration: 86400,
        label: "Daily"
      }
    ];
  });

  describe("when range is omitted", () => {
    test("should return null", () => {
      const result = clampPeriodByRange(PERIODS);
      expect(result).toBeNull();
    });
  });

  describe("when selected period arg is", () => {
    describe("omitted", () => {
      test("should return the median possible period", () => {
        const result = clampPeriodByRange(PERIODS, 3600);
        expect(result).toEqual(120);
      });
    });

    describe("less than passed range", () => {
      test("should return selectedPeriod", () => {
        const result = clampPeriodByRange(PERIODS, 3600, 60);
        expect(result).toEqual(60);
      });
    });

    describe("is negative for some reason", () => {
      test("should return the median possible period", () => {
        const result = clampPeriodByRange(PERIODS, 3600, 3600);
        expect(result).toEqual(120);
      });
    });

    describe("equal to passed range", () => {
      test("should return the median possible period", () => {
        const result = clampPeriodByRange(PERIODS, 3600, 3600);
        expect(result).toEqual(120);
      });
    });

    describe("greater than passed range", () => {
      test("should return the median possible period", () => {
        const result = clampPeriodByRange(PERIODS, 3600, 7200);
        expect(result).toEqual(120);
      });
    });
  });
});
