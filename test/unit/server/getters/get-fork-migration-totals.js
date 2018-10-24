const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-fork-migration-totals", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
      const db = await setupTestDb();
      t.method = "getForkMigrationTotals";
      dispatchJsonRpcRequest(db, t, t.params.augur, (err, forkMigrationTotals) => {
        t.assertions(err, forkMigrationTotals);
        db.destroy();
        done();
      });
    });
  };
  runTest({
    description: "get the fork migration totals",
    params: {
      parentUniverse: "0x000000000000000000000000000000000000000b",
      augur: {},
    },
    assertions: (err, forkMigrationTotals) => {
      expect(err).toBeFalsy();
      expect(forkMigrationTotals).toEqual({
        "CHILD_UNIVERSE": {
          "isInvalid": false,
          "payout": [
            "0",
            "10000",
          ],
          "repTotal": "2000",
          "universe": "CHILD_UNIVERSE",
        },
      });
    },
  });
});
