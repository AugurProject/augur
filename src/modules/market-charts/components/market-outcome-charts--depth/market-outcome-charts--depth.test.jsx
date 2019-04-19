import { nearestCompletelyFillingOrder } from "src/modules/market-charts/components/market-outcome-charts--depth/market-outcome-charts--depth";

import { ASKS, BIDS } from "modules/common-elements/constants";
import { createBigNumber } from "src/utils/create-big-number";

describe("src/modules/market-charts/components/market-outcome-charts--depth/market-outcome-charts--depth.jsx", () => {
  let price;
  let result;

  // depth, price, qty, isSelectable
  let marketDepth = {
    bids: [
      [createBigNumber(0.0001), 0.28, 0.003, true],
      [createBigNumber(0.001), 0.28, 0.001, false],
      [createBigNumber(0.003), 0.25, 0.002, true],
      [createBigNumber(0.006), 0.19, 0.003, true]
    ],
    asks: [
      [createBigNumber(0.0005), 0.28, 0.001, false],
      [createBigNumber(0.0005), 0.28, 0.001, true],
      [createBigNumber(0.001), 0.31, 0.0015, true],
      [createBigNumber(0.003), 0.35, 0.002, true],
      [createBigNumber(0.006), 0.4, 0.003, true]
    ]
  };

  const marketMax = createBigNumber(1);
  const marketMin = createBigNumber(0);

  describe("price 0.19", () => {
    beforeEach(() => {
      price = 0.19;
      result = nearestCompletelyFillingOrder(
        price,
        marketDepth,
        marketMin,
        marketMax
      );
    });

    test("should return an order with depth 0.006", () => {
      expect(result[0].toNumber()).toBe(0.006);
    });

    test("should return the order with matching price", () => {
      expect(result[1]).toBe(price);
    });

    test("should return an order that is selectable", () => {
      expect(result[3]).toBeTruthy();
    });

    test("should be a bid order", () => {
      expect(result[4]).toEqual(BIDS);
    });
  });

  describe("price 0.4", () => {
    beforeEach(() => {
      price = 0.4;
      result = nearestCompletelyFillingOrder(
        price,
        marketDepth,
        marketMin,
        marketMax
      );
    });

    test("should return the order with matching price", () => {
      expect(result[1]).toEqual(price);
    });

    test("should return an asks order", () => {
      expect(result[4]).toEqual(ASKS);
    });
  });

  describe("undefined price", () => {
    beforeEach(() => {
      result = nearestCompletelyFillingOrder(
        undefined,
        marketDepth,
        marketMin,
        marketMax
      );
    });

    test("should return undefined", () => {
      expect(result).toBeNull();
    });
  });

  // for some reason the above case returned the correct 'isSelectable' values.
  // Adding another case where it does not work.
  describe("second scenario", () => {
    marketDepth = {
      bids: [
        [createBigNumber("0.001"), 0.28, 0.001, true],
        [createBigNumber("0.003"), 0.25, 0.002, true],
        [createBigNumber("0.006"), 0.19, 0.003, true]
      ],
      asks: [
        [createBigNumber("0.001"), 0.35, 0.002, false],
        [createBigNumber("0.002"), 0.35, 0.002, true],
        [createBigNumber("0.005"), 0.4, 0.003, true]
      ]
    };

    test("should work be selectable", () => {
      price = 0.35;
      result = nearestCompletelyFillingOrder(
        price,
        marketDepth,
        marketMin,
        marketMax
      );

      expect(result[3]).toBeTruthy();
    });
  });
});
