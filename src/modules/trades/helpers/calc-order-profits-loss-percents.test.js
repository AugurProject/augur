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
    const actual = calcProfits(
      "10",
      "0.4",
      BUY,
      "0",
      "1",
      YES_NO,
      "10",
      "4",
      "0.02"
    );

    const expected = {
      potentialEthProfit: createBigNumber("5.8"),
      potentialEthLoss: createBigNumber("4"),
      potentialProfitPercent: createBigNumber("145"),
      potentialLossPercent: createBigNumber("100"),
      tradingFees: createBigNumber("0.2")
    };

    expect(actual).toEqual(expected);
  });

  test(`should return the expected profit and loss values for a SELL in a yes/no market`, () => {
    const actual = calcProfits(
      "10",
      "0.4",
      SELL,
      "0",
      "1",
      YES_NO,
      "10",
      "6",
      "0.04"
    );

    const expected = {
      potentialEthProfit: createBigNumber("3.6"),
      potentialEthLoss: createBigNumber("6"),
      potentialProfitPercent: createBigNumber("60"),
      potentialLossPercent: createBigNumber("100"),
      tradingFees: createBigNumber("0.4")
    };

    expect(actual).toEqual(expected);
  });

  test(`should return the expected profit and loss values for a BUY in a SCALAR market`, () => {
    const actual = calcProfits(
      "10",
      "1",
      BUY,
      "-5",
      "10",
      SCALAR,
      "10",
      "60",
      "0.25"
    );

    const expected = {
      potentialEthProfit: createBigNumber("52.5"),
      potentialEthLoss: createBigNumber("60"),
      potentialProfitPercent: createBigNumber("87.5"),
      potentialLossPercent: createBigNumber("100"),
      tradingFees: createBigNumber("37.5")
    };

    expect(actual).toEqual(expected);
  });

  test(`should return the expected profit and loss values for a SELL in a SCALAR market`, () => {
    const actual = calcProfits(
      "10",
      "1",
      SELL,
      "-5",
      "10",
      SCALAR,
      "10",
      "90",
      "0.2"
    );

    const expected = {
      potentialEthProfit: createBigNumber("30"),
      potentialEthLoss: createBigNumber("90"),
      potentialProfitPercent: createBigNumber("33.333333333333333333"),
      potentialLossPercent: createBigNumber("100"),
      tradingFees: createBigNumber("30")
    };

    expect(actual).toEqual(expected);
  });
});
