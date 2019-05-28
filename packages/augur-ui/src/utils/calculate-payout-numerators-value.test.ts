import { YES_NO, CATEGORICAL, SCALAR } from "modules/common-elements/constants";
import calculatePayoutNumeratorsValue from "utils/calculate-payout-numerators-value";

describe(`utils/calculate-payout-numerators-value.js`, () => {
  const marketScalarMin = {
    maxPrice: 120,
    minPrice: -10,
    numTicks: 1300,
    numOutcomes: 2,
    marketType: SCALAR
  };

  const marketScalar = {
    maxPrice: 100,
    minPrice: 0,
    numTicks: 10000,
    numOutcomes: 2,
    marketType: SCALAR
  };

  const marketBinary = {
    maxPrice: 100,
    minPrice: 0,
    numTicks: 10000,
    numOutcomes: 2,
    marketType: YES_NO
  };

  const marketCategorical = {
    maxPrice: 100,
    minPrice: 0,
    numTicks: 10003,
    numOutcomes: 7,
    marketType: CATEGORICAL
  };

  describe("scalar 75", () => {
    test(`should call the expected method`, () => {
      const actual = calculatePayoutNumeratorsValue(
        marketScalar,
        [2500, 7500],
        false
      );
      const expected = "75";
      expect(actual).toEqual(expected);
    });
  });

  describe("scalar sub 0 Min 75", () => {
    test(`should call the expected method`, () => {
      const actual = calculatePayoutNumeratorsValue(
        marketScalarMin,
        [450, 850],
        false
      );
      const expected = "75";
      expect(actual).toEqual(expected);
    });
  });

  describe("scalar sub 0 Min 73", () => {
    test(`should call the expected method`, () => {
      const actual = calculatePayoutNumeratorsValue(
        marketScalarMin,
        [470, 830],
        false
      );
      const expected = "73";
      expect(actual).toEqual(expected);
    });
  });

  describe("scalar sub 0 Min 25", () => {
    test(`should call the expected method`, () => {
      const actual = calculatePayoutNumeratorsValue(
        marketScalarMin,
        [950, 350],
        false
      );
      const expected = "25";
      expect(actual).toEqual(expected);
    });
  });

  describe("scalar 50", () => {
    test(`should call the expected method`, () => {
      const actual = calculatePayoutNumeratorsValue(
        marketScalar,
        [5000, 5000],
        false
      );
      const expected = "50";
      expect(actual).toEqual(expected);
    });
  });

  describe("scalar 25", () => {
    test(`should call the expected method`, () => {
      const actual = calculatePayoutNumeratorsValue(
        marketScalar,
        [7500, 2500],
        false
      );
      const expected = "25";
      expect(actual).toEqual(expected);
    });
  });

  describe("scalar 45.01", () => {
    test(`should call the expected method`, () => {
      const actual = calculatePayoutNumeratorsValue(
        marketScalar,
        [5499, 4501],
        false
      );
      const expected = "45.01";
      expect(actual).toEqual(expected);
    });
  });

  describe("scalar invalid", () => {
    test(`should call the expected method`, () => {
      const actual = calculatePayoutNumeratorsValue(
        marketScalar,
        [5000, 5000],
        true
      );
      const expected = null;
      expect(actual).toEqual(expected);
    });
  });

  describe("yes/no NO", () => {
    test(`should call the expected method`, () => {
      const actual = calculatePayoutNumeratorsValue(
        marketBinary,
        [10000, 0],
        false
      );
      const expected = "0";
      expect(actual).toEqual(expected);
    });
  });

  describe("yes/no YES", () => {
    test(`should call the expected method`, () => {
      const actual = calculatePayoutNumeratorsValue(
        marketBinary,
        [0, 10000],
        false
      );
      const expected = "1";
      expect(actual).toEqual(expected);
    });
  });

  describe("yes/no invalid", () => {
    test(`should call the expected method`, () => {
      const actual = calculatePayoutNumeratorsValue(
        marketBinary,
        [5000, 5000],
        true
      );
      const expected = null;
      expect(actual).toEqual(expected);
    });
  });

  describe("categorical 0", () => {
    test(`should call the expected method`, () => {
      const actual = calculatePayoutNumeratorsValue(
        marketCategorical,
        [10003, 0, 0, 0, 0, 0, 0],
        false
      );
      const expected = "0";
      expect(actual).toEqual(expected);
    });
  });

  describe("categorical 3", () => {
    test(`should call the expected method`, () => {
      const actual = calculatePayoutNumeratorsValue(
        marketCategorical,
        [0, 0, 0, 10003, 0, 0, 0],
        false
      );
      const expected = "3";
      expect(actual).toEqual(expected);
    });
  });

  describe("categorical 6", () => {
    test(`should call the expected method`, () => {
      const actual = calculatePayoutNumeratorsValue(
        marketCategorical,
        [0, 0, 0, 0, 0, 0, 10003],
        false
      );
      const expected = "6";
      expect(actual).toEqual(expected);
    });
  });

  describe("categorical invalid", () => {
    test(`should call the expected method`, () => {
      const actual = calculatePayoutNumeratorsValue(
        marketCategorical,
        [1429, 1429, 1429, 1429, 1429, 1429, 1429],
        true
      );
      const expected = null;
      expect(actual).toEqual(expected);
    });
  });
});
