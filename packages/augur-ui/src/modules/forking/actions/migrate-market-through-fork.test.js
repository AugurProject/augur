import { migrateMarketThroughFork } from "modules/forking/actions/migrate-market-through-fork";
import { augur } from "services/augurjs";

describe("modules/forking/actions/migrate-market-through-fork.js", () => {
  describe("migrateMarketThroughFork", () => {
    test("Called the function as expected", () => {
      const getState = () => ({
        loginAccount: {
          meta: "META"
        }
      });
      jest
        .spyOn(augur.api.Market, "migrateThroughOneFork")
        .mockImplementation(args => {
          expect(args.tx).toEqual({
            to: "0xMARKET",
            estimateGas: false
          });
          return args.onSuccess(null);
        });

      migrateMarketThroughFork("0xMARKET", false, () => {})(() => {}, getState);
    });
  });
});
