import { createBigNumber } from "utils/create-big-number";

import calcProfits from "modules/trades/helpers/calc-order-profit-loss-percents";

import { BUY, SELL } from "modules/transactions/constants/types";
import { YES_NO, SCALAR } from "modules/markets/constants/market-types";

describe("modules/trades/helpers/calc-order-profit-loss-percents.js", () => {
  const test = t => it(t.description, () => t.assertions());

  test({
    description: `should return null when an argument is missing`,
    assertions: () => {
      const actual = calcProfits();

      const expected = null;

      assert.strictEqual(actual, expected, `didn't return the expected value`);
    }
  });

  test({
    description: `should return null when given a SCALAR market with non numerical minPrice`,
    assertions: () => {
      const actual = calcProfits(
        "10",
        "1",
        SELL,
        "190-242nota valid number",
        "10",
        SCALAR
      );

      const expected = null;

      assert.strictEqual(actual, expected, `didn't return the expected value`);
    }
  });

  test({
    description: `should return null when given a SCALAR market with non numerical maxPrice`,
    assertions: () => {
      const actual = calcProfits(
        "10",
        "1",
        SELL,
        "-1",
        "10abc this is not a valid number",
        SCALAR
      );

      const expected = null;

      assert.strictEqual(actual, expected, `didn't return the expected value`);
    }
  });

  test({
    description: `should return the expected profit and loss values for a BUY in a yes/no market`,
    assertions: () => {
      // numShares, limitPrice, side, minPrice, maxPrice, type, sharesFilled, tradeTotalCost, settlementFee
      const actual = calcProfits("10", "0.4", BUY, "0", "1", YES_NO, "10", "4", "0.02");

      const expected = {
        potentialEthProfit: createBigNumber("5.8"),
        potentialEthLoss: createBigNumber("4"),
        potentialProfitPercent: createBigNumber("145"),
        potentialLossPercent: createBigNumber("100"),
        tradingFees: createBigNumber("0.2")
      };
      
      assert.deepEqual(
        actual,
        expected,
        `didn't return the expected profit and loss values`
      );
    }
  });

  test({
    description: `should return the expected profit and loss values for a SELL in a yes/no market`,
    assertions: () => {
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

      assert.deepEqual(
        actual,
        expected,
        `didn't return the expected profit and loss values`
      );
    }
  });

  test({
    description: `should return the expected profit and loss values for a BUY in a SCALAR market`,
    assertions: () => {
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

      assert.deepEqual(
        actual,
        expected,
        `didn't return the expected profit and loss values`
      );
    }
  });

  test({
    description: `should return the expected profit and loss values for a SELL in a SCALAR market`,
    assertions: () => {
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

      assert.deepEqual(
        actual,
        expected,
        `didn't return the expected profit and loss values`
      );
    }
  });
});
