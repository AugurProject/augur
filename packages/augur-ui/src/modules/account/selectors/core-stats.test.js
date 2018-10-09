import { createBigNumber } from "utils/create-big-number";
import { ZERO } from "modules/trades/constants/numbers";

const coreStats = require("modules/account/selectors/core-stats");

describe("modules/account/selectors/core-stats", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe("selectOutcomeLastPrice", () => {
    test("should return null when 'marketOutcomeData' is undefined", () => {
      const actual = coreStats.selectOutcomeLastPrice(undefined, 1);
      expect(actual).toBeNull();
    });

    test("should return null when 'outcomeId' is undefined", () => {
      const actual = coreStats.selectOutcomeLastPrice({}, undefined);
      expect(actual).toBeNull();
    });

    test("should return the price when data exists", () => {
      const actual = coreStats.selectOutcomeLastPrice(
        { 1: { price: "0.1" } },
        1
      );
      expect(actual).toStrictEqual("0.1");
    });

    test("should return undefined when data does not exist", () => {
      const actual = coreStats.selectOutcomeLastPrice(
        { 2: { price: "0.1" } },
        1
      );
      expect(actual).toBeUndefined();
    });
  });

  describe("createPeriodPLSelector", () => {
    test("should return null when 'accountTrades' is undefined", () => {
      const selector = coreStats.createPeriodPLSelector(1);
      const actual = selector.resultFunc(undefined, {}, undefined);
      expect(actual).toBeNull();
    });

    test("should return null when 'blockchain' is undefined", () => {
      const selector = coreStats.createPeriodPLSelector(1);
      const actual = selector.resultFunc({}, undefined, undefined);
      expect(actual).toBeNull();
    });

    test("should return 0 for a set period with no trades", () => {
      const accountTrades = {
        "0xMarketID1": {
          1: [
            {
              blockNumber: 90000
            },
            {
              blockNumber: 90001
            }
          ],
          2: [
            {
              blockNumber: 90000
            },
            {
              blockNumber: 90001
            }
          ]
        }
      };

      const blockchain = {
        currentBlockNumber: 100000
      };

      const outcomesData = {
        "0xMarketID1": {}
      };

      const selector = coreStats.createPeriodPLSelector(1);

      const actual = selector.resultFunc(
        accountTrades,
        blockchain,
        outcomesData
      );

      expect(actual).toStrictEqual(ZERO);
    });

    test("should return the expected value for a set period with trades", () => {
      const accountTrades = {
        "0xMarketID1": {
          1: [
            {
              blockNumber: 95000
            },
            {
              blockNumber: 96000
            }
          ],
          2: [
            {
              blockNumber: 95000
            },
            {
              blockNumber: 96000
            }
          ]
        }
      };

      const blockchain = {
        currentBlockNumber: 100000
      };

      const outcomesData = {
        "0xMarketID1": {}
      };
      jest.doMock("../../../services/augurjs.js");
      const coreStats = require("modules/account/selectors/core-stats");
      const coreStatsMock = Object.assign(coreStats);
      coreStatsMock.selectOutcomeLastPrice = jest.fn(() => "0.2");
      const selector = coreStatsMock.createPeriodPLSelector(1);

      const actual = selector.resultFunc(
        accountTrades,
        blockchain,
        outcomesData
      );

      const expected = createBigNumber("2");

      expect(actual).toStrictEqual(expected);
    });
  });
});
