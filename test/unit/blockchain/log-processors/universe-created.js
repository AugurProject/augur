const setupTestDb = require("../../test.database");
const { processUniverseCreatedLog, processUniverseCreatedLogRemoval } = require("src/blockchain/log-processors/universe-created");

function getUniverse(db, log) {
  return db("universes").first().where({ universe: log.childUniverse });
}

const augur = {
  api: {
    Universe: {
      getReputationToken: () => Promise.resolve("0x0000000000000000000000000000000000000222"),
    },
  },
};


describe("blockchain/log-processors/universe-created", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const log = {
    childUniverse: "0x000000000000000000000000000000000000000c",
    parentUniverse: "0x000000000000000000000000000000000000000b",
    payoutNumerators: [0, 10000],
    invalid: false,
  };

  test("New universe created", async () => {
    return db.transaction(async (trx) => {
      await processUniverseCreatedLog(trx, augur, log);

      const records = await getUniverse(trx, log);
      expect(records.universe).toEqual("0x000000000000000000000000000000000000000c");
      expect(records.parentUniverse).toEqual("0x000000000000000000000000000000000000000b");
      expect(records.reputationToken).toEqual("0x0000000000000000000000000000000000000222");
      expect(records.forked).toEqual(0);
      expect(typeof records.payoutId).toBe("number");

      await processUniverseCreatedLogRemoval(trx, augur, log);

      await expect(getUniverse(trx, log)).resolves.toBeUndefined();

    });
  });
  afterEach(async () => {
    await db.destroy();
  });
});
