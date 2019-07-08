// @ts-ignore
import { YES_NO } from "modules/common-elements/constants";
// @ts-ignore
import { getForkMigrationTotals } from "modules/forking/actions/get-fork-migration-totals";
// @ts-ignore

describe("modules/forking/actions/get-fork-migration-totals.js", () => {
  test("Returned the expected object", () => {
    const forkMigrationTotalsData = {
      "0xCHILD_1": {
        payout: [0, 10000],
        isInvalid: false,
        repTotal: 200,
        universe: "0xCHILD_1",
      },
      "0xCHILD_2": {
        payout: [10000, 0],
        isInvalid: false,
        repTotal: 400,
        universe: "0xCHILD_2",
      },
    };
    const getState = () => ({
      universe: {
        winningChildUniverse: "0xCHILD_1",
      },
      marketsData: {
        "0xMARKET": {
          maxPrice: 1,
          minPrice: 0,
          numTicks: 10000,
          marketType: YES_NO,
        },
      },
    });

    const expected = {
      0: {
        repTotal: 400,
        winner: false,
        isInvalid: false,
      },
      1: {
        repTotal: 200,
        winner: true,
        isInvalid: false,
      },
    };

    getForkMigrationTotals("0xUNIVERSE", (err, actual) => {
      expect(actual).toEqual(expected);
    })(null, getState);
  });
});
