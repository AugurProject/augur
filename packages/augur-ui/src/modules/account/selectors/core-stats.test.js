import { createBigNumber } from "utils/create-big-number";
import { ZERO } from "modules/trades/constants/numbers";

const coreStats = require("modules/account/selectors/core-stats");

describe("modules/account/selectors/core-stats", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe("selectOutcomeLastPrice", () => {
    test("returned null when 'marketOutcomeData' is undefined", () => {
      const actual = coreStats.selectOutcomeLastPrice(undefined, 1);
      expect(actual).toBeNull();
    });

    test("returned null when 'outcomeId' is undefined", () => {
      const actual = coreStats.selectOutcomeLastPrice({}, undefined);
      expect(actual).toBeNull();
    });

    test("returned the price when data exists", () => {
      const actual = coreStats.selectOutcomeLastPrice(
        { 1: { price: "0.1" } },
        1
      );
      expect(actual).toStrictEqual("0.1");
    });

    test("returned undefined when data does not exist", () => {
      const actual = coreStats.selectOutcomeLastPrice(
        { 2: { price: "0.1" } },
        1
      );
      expect(actual).toBeUndefined();
    });
  });

  describe("createPeriodPLSelector", () => {
    test("returned null when 'accountTrades' is undefined", () => {
      const selector = coreStats.createPeriodPLSelector(1);
      const actual = selector.resultFunc(undefined, {}, undefined);
      expect(actual).toBeNull();
    });

    test("returned null when 'blockchain' is undefined", () => {
      const selector = coreStats.createPeriodPLSelector(1);
      const actual = selector.resultFunc({}, undefined, undefined);
      expect(actual).toBeNull();
    });

    test("returned 0 for a set period with no trades", () => {
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

    test("returned the expected value for a set period with trades", () => {
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
      const realAugur = require.requireActual("../../../services/augurjs.js");
      jest.doMock("../../../services/augurjs.js", () => ({
        constants: realAugur.constants,
        augur: {
          rpc: {
            constants: realAugur.augur.rpc.constants
          },
          trading: {
            calculateProfitLoss: () => ({
              realized: "-1",
              unrealized: "2"
            })
          }
        }
      }));
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
