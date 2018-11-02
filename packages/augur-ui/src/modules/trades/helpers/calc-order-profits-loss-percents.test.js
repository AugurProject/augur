import { createBigNumber } from "utils/create-big-number";

import calcProfits from "modules/trades/helpers/calc-order-profit-loss-percents";

import { BUY, SELL } from "modules/transactions/constants/types";
import { YES_NO, SCALAR } from "modules/markets/constants/market-types";

describe("modules/trades/helpers/calc-order-profit-loss-percents.js", () => {
  test(`should return null when an argument is missing`, () => {
    const actual = calcProfits();

    const expected = null;

    expect(actual).toBe(expected);
  });

  test(`should return null when given a SCALAR market with non numerical minPrice`, () => {
    const actual = calcProfits(
      "10",
      "1",
      SELL,
      "190-242nota valid number",
      "10",
      SCALAR
    );

    const expected = null;

    expect(actual).toBe(expected);
  });

  test(`should return null when given a SCALAR market with non numerical maxPrice`, () => {
    const actual = calcProfits(
      "10",
      "1",
      SELL,
      "-1",
      "10abc this is not a valid number",
      SCALAR
    );

    const expected = null;

    expect(actual).toBe(expected);
  });

  test(`should return the expected profit and loss values for a BUY in a yes/no market`, () => {
    // numShares, limitPrice, side, minPrice, maxPrice, type, sharesFilled, tradeTotalCost
    const actual = calcProfits("10", "0.4", BUY, "0", "1", YES_NO, "10", "4");

    const expected = {
      potentialEthProfit: createBigNumber("6"),
      potentialEthLoss: createBigNumber("4"),
      potentialProfitPercent: createBigNumber("150"),
      potentialLossPercent: createBigNumber("100")
    };

    expect(actual).toEqual(expected);
  });

  test(`should return the expected profit and loss values for a SELL in a yes/no market`, () => {
    const actual = calcProfits("10", "0.4", SELL, "0", "1", YES_NO, "10", "6");

    const expected = {
      potentialEthProfit: createBigNumber("4"),
      potentialEthLoss: createBigNumber("6"),
      potentialProfitPercent: createBigNumber("66.666666666666666667"),
      potentialLossPercent: createBigNumber("100")
    };

    expect(actual).toEqual(expected);
  });

  test(`should return the expected profit and loss values for a BUY in a SCALAR market`, () => {
    const actual = calcProfits("10", "1", BUY, "-5", "10", SCALAR, "10", "60");

    const expected = {
      potentialEthProfit: createBigNumber("90"),
      potentialEthLoss: createBigNumber("60"),
      potentialProfitPercent: createBigNumber("150"),
      potentialLossPercent: createBigNumber("100")
    };

    expect(actual).toEqual(expected);
  });

  test(`should return the expected profit and loss values for a SELL in a SCALAR market`, () => {
    const actual = calcProfits("10", "1", SELL, "-5", "10", SCALAR, "10", "90");

    const expected = {
      potentialEthProfit: createBigNumber("60"),
      potentialEthLoss: createBigNumber("90"),
      potentialProfitPercent: createBigNumber("66.666666666666666667"),
      potentialLossPercent: createBigNumber("100")
    };

    expect(actual).toEqual(expected);
  });
});
