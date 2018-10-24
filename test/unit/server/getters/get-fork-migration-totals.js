const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-fork-migration-totals", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  afterEach(async () => {
    await db.destroy();
  });

  const runTest = (t) => {
    test(t.description, async () => {
      t.method = "getForkMigrationTotals";
      const forkMigrationTotals = await dispatchJsonRpcRequest(db, t, t.params.augur);
      t.assertions(forkMigrationTotals);
    });
  };
  runTest({
    description: "get the fork migration totals",
    params: {
      parentUniverse: "0x000000000000000000000000000000000000000b",
      augur: {},
    },
    assertions: (forkMigrationTotals) => {
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
