import { CATEGORICAL, SCALAR, YES_NO } from "modules/common-elements/constants";
import { getPayoutNumerators } from "modules/reports/selectors/get-payout-numerators";
import { createBigNumber } from "utils/create-big-number";

describe(`modules/reports/actions/get-payout-numerators.js`, () => {
  const marketScalarMin = {
    maxPrice: createBigNumber(120),
    minPrice: createBigNumber(-10),
    numTicks: "1300",
    numOutcomes: 2,
    marketType: SCALAR
  };

  const marketScalar = {
    maxPrice: createBigNumber(100),
    minPrice: createBigNumber(0),
    numTicks: "10000",
    numOutcomes: 2,
    marketType: SCALAR
  };

  const marketBinary = {
    maxPrice: createBigNumber(100),
    minPrice: createBigNumber(0),
    numTicks: "10000",
    numOutcomes: 2,
    marketType: YES_NO
  };

  const marketCategorical = {
    maxPrice: createBigNumber(100),
    minPrice: createBigNumber(0),
    numTicks: "10003",
    numOutcomes: 7,
    marketType: CATEGORICAL
  };

  describe("scalar 75", () => {
    test(`should call the expected method`, () => {
      const actual = getPayoutNumerators(marketScalar, "75", false).map(n =>
        n.toString()
      );
      const expected = ["2500", "7500"];
      expect(actual).toEqual(expected);
      expect(
        createBigNumber(expected[0])
          .plus(createBigNumber(expected[1]))
          .toFixed()
      ).toEqual(marketScalar.numTicks);
    });
  });

  describe("scalar 75 sub 0 Min", () => {
    test(`should call the expected method`, () => {
      const actual = getPayoutNumerators(marketScalarMin, "75", false).map(n =>
        n.toString()
      );
      const expected = ["450", "850"];
      expect(actual).toEqual(expected);
      expect(
        createBigNumber(expected[0])
          .plus(createBigNumber(expected[1]))
          .toFixed()
      ).toEqual(marketScalarMin.numTicks);
    });
  });

  describe("scalar 25 sub 0 Min", () => {
    test(`should call the expected method`, () => {
      const actual = getPayoutNumerators(marketScalarMin, "25", false).map(n =>
        n.toString()
      );
      const expected = ["950", "350"];
      expect(actual).toEqual(expected);
      expect(
        createBigNumber(expected[0])
          .plus(createBigNumber(expected[1]))
          .toFixed()
      ).toEqual(marketScalarMin.numTicks);
    });
  });

  describe("scalar 50", () => {
    test(`should call the expected method`, () => {
      const actual = getPayoutNumerators(marketScalar, "50", false).map(n =>
        n.toString()
      );
      const expected = ["5000", "5000"];
      expect(actual).toEqual(expected);
      expect(
        createBigNumber(expected[0])
          .plus(createBigNumber(expected[1]))
          .toFixed()
      ).toEqual(marketScalar.numTicks);
    });
  });

  describe("scalar 25", () => {
    test(`should call the expected method`, () => {
      const actual = getPayoutNumerators(marketScalar, "25", false).map(n =>
        n.toString()
      );
      const expected = ["7500", "2500"];
      expect(actual).toEqual(expected);
      expect(
        createBigNumber(expected[0])
          .plus(createBigNumber(expected[1]))
          .toFixed()
      ).toEqual(marketScalar.numTicks);
    });
  });

  describe("scalar 45.01", () => {
    test(`should call the expected method`, () => {
      const actual = getPayoutNumerators(marketScalar, "45.01", false).map(n =>
        n.toString()
      );
      const expected = ["5499", "4501"];
      expect(actual).toEqual(expected);
      expect(
        createBigNumber(expected[0])
          .plus(createBigNumber(expected[1]))
          .toFixed()
      ).toEqual(marketScalar.numTicks);
    });
  });

  describe("scalar invalid", () => {
    test(`should call the expected method`, () => {
      const actual = getPayoutNumerators(marketScalar, "0", true).map(n =>
        n.toString()
      );
      const expected = ["5000", "5000"];
      expect(actual).toEqual(expected);
      expect(
        createBigNumber(expected[0])
          .plus(createBigNumber(expected[1]))
          .toFixed()
      ).toEqual(marketScalar.numTicks);
    });
  });

  describe("yes/no NO", () => {
    test(`should call the expected method`, () => {
      const actual = getPayoutNumerators(marketBinary, 0, false).map(n =>
        n.toString()
      );
      const expected = ["10000", "0"];
      expect(actual).toEqual(expected);
    });
  });

  describe("yes/no YES", () => {
    test(`should call the expected method`, () => {
      const actual = getPayoutNumerators(marketBinary, 1, false).map(n =>
        n.toString()
      );
      const expected = ["0", "10000"];
      expect(actual).toEqual(expected);
    });
  });

  describe("yes/no invalid", () => {
    test(`should call the expected method`, () => {
      const actual = getPayoutNumerators(marketBinary, 1, true).map(n =>
        n.toString()
      );
      const expected = ["5000", "5000"];
      expect(actual).toEqual(expected);
    });
  });

  describe("categorical 0", () => {
    test(`should call the expected method`, () => {
      const actual = getPayoutNumerators(marketCategorical, 0, false).map(n =>
        n.toString()
      );
      const expected = ["10003", "0", "0", "0", "0", "0", "0"];
      expect(actual).toEqual(expected);
    });
  });

  describe("categorical 3", () => {
    test(`should call the expected method`, () => {
      const actual = getPayoutNumerators(marketCategorical, 3, false).map(n =>
        n.toString()
      );
      const expected = ["0", "0", "0", "10003", "0", "0", "0"];
      expect(actual).toEqual(expected);
    });
  });

  describe("categorical 6", () => {
    test(`should call the expected method`, () => {
      const actual = getPayoutNumerators(marketCategorical, 6, false).map(n =>
        n.toString()
      );
      const expected = ["0", "0", "0", "0", "0", "0", "10003"];
      expect(actual).toEqual(expected);
    });
  });

  describe("categorical invalid", () => {
    test(`should call the expected method`, () => {
      const actual = getPayoutNumerators(marketCategorical, 0, true).map(n =>
        n.toString()
      );
      const expected = ["1429", "1429", "1429", "1429", "1429", "1429", "1429"];
      expect(actual).toEqual(expected);
    });
  });
});
