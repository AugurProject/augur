import { YES_NO } from "modules/common-elements/constants";
import { submitMigrateREP } from "modules/forking/actions/submit-migrate-rep";
import { augur } from "services/augurjs";

describe("modules/forking/actions/submit-migrate-rep.js", () => {
  describe("submitMigrateREP", () => {
    test("Called the function as expected", () => {
      const getState = () => ({
        loginAccount: {
          meta: "META"
        },
        universe: {
          id: "0xUNIVERSE"
        },
        marketsData: {
          "0xMARKET": {
            maxPrice: 1,
            minPrice: 0,
            numTicks: 10000,
            marketType: YES_NO
          }
        }
      });

      jest
        .spyOn(augur.api.Universe, "getReputationToken")
        .mockImplementation((args, callback) => {
          expect(args).toEqual({
            tx: { to: "0xUNIVERSE" }
          });
          return callback(null, "0xREP_TOKEN");
        });
      jest
        .spyOn(augur.api.ReputationToken, "migrateOutByPayout")
        .mockImplementation(args => {
          expect(args.tx).toEqual({
            to: "0xREP_TOKEN",
            estimateGas: false
          });
          expect(args.meta).toEqual("META");
          expect(args._invalid).toBe(false);
          expect(args._payoutNumerators.map(n => n.toString())).toEqual([
            "0",
            "10000"
          ]);
          expect(args._attotokens).toBe(42);
        });
      submitMigrateREP({
        estimateGas: false,
        marketId: "0xMARKET",
        selectedOutcome: 1,
        invalid: false,
        amount: 42,
        history: null,
        callback: () => {}
      })(null, getState);
    });
  });
});
