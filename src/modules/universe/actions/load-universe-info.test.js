import { YES_NO } from "modules/markets/constants/market-types";
import { loadUniverseInfo } from "modules/universe/actions/load-universe-info";

jest.mock("services/augurjs");

describe("modules/account/actions/load-universe-info.js", () => {
  describe("loadUniverseInfo", () => {
    test("should return the expected object", () => {
      const stateData = {
        loginAccount: {
          address: "0xACCOUNT"
        },
        universe: {
          winningChildUniverse: "0xCHILD_1",
          forkingMarket: "0xMARKET",
          id: "0xGENESIS",
          isForking: true
        },
        marketsData: {
          "0xMARKET": {
            maxPrice: 1,
            minPrice: 0,
            numTicks: 10000,
            marketType: YES_NO
          }
        }
      };

      const getState = () => stateData;

      const expected = {
        parent: null,
        children: [
          {
            universe: "0xCHILD_1",
            payout: [10000, 0],
            isInvalid: false,
            numMarkets: 400,
            openInterest: "1000000",
            parentUniverse: "0xGENESIS",
            description: "No",
            isWinningUniverse: true
          }
        ],
        currentLevel: [
          {
            universe: "0xGENESIS",
            payout: [],
            isInvalid: false,
            numMarkets: 15,
            openInterest: "1000000",
            supply: "1100000000000000000000000",
            parentUniverse: "0x0000000000000000000000000000000000000000",
            description: "GENESIS",
            isWinningUniverse: false
          }
        ]
      };

      loadUniverseInfo((err, actual) => {
        expect(err).toStrictEqual(null);
        expect(actual).toStrictEqual(expected);
      })(null, getState);
    });
  });
});
