import { YES_NO } from "modules/markets/constants/market-types";
import { loadUniverseInfo } from "modules/universe/actions/load-universe-info";

jest.mock("services/augurjs", () => ({
  augur: {
    api: {
      Universe: {
        getParentUniverse: (args, callback) => {
          expect(args).toEqual({
            tx: { to: "0xGENESIS" }
          });
          return callback(null, "0x0000000000000000000000000000000000000000");
        },
        getOpenInterestInAttoEth: (args, callback) => {
          callback(null, "1000000");
        }
      }
    },
    augurNode: {
      submitRequest: (methodName, args, callback) => {
        expect(methodName).toEqual("getUniversesInfo");
        expect(args).toEqual({
          universe: "0xGENESIS",
          account: "0xACCOUNT"
        });
        return callback(null, [
          {
            universe: "0xGENESIS",
            payout: [],
            isInvalid: false,
            numMarkets: 15,
            supply: "1100000000000000000000000",
            parentUniverse: "0x0000000000000000000000000000000000000000"
          },
          {
            universe: "0xGENESIS_2",
            payout: [],
            isInvalid: false,
            numMarkets: 0,
            supply: "50000000000000000000000",
            parentUniverse: "0x0000000000000000000000000000000000000000"
          },
          {
            universe: "0xCHILD_1",
            payout: [10000, 0],
            isInvalid: false,
            numMarkets: 400,
            parentUniverse: "0xGENESIS"
          }
        ]);
      }
    }
  }
}));

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
