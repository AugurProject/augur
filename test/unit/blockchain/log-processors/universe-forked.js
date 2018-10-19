const setupTestDb = require("../../test.database");
const { processUniverseForkedLog, processUniverseForkedLogRemoval } = require("src/blockchain/log-processors/universe-forked");

async function getForkRows(db, log) {
  return {
    forkingMarket: await db("markets").where({ universe: log.universe, forking: 1 }),
    otherMarket: await db("markets").where({ marketId: otherMarket }),
    universe: await db("universes").where({ universe: log.universe }),
  };
}

const otherMarket = "0x0000000000000000000000000000000000000222";

const augur = {
  api: {
    Universe: {
      getForkingMarket: () => Promise.resolve("0x0000000000000000000000000000000000000211"),
    },
  },
};

describe("blockchain/log-processors/universe-forked", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const log = {
    universe: "0x000000000000000000000000000000000000000b",
    blockNumber: 1500001,
  };
  test("New universe created", async () => {
    return db.transaction(async (trx) => {
      await processUniverseForkedLog(trx, augur, log);
      const records = await getForkRows(trx, log);
      expect(records.forkingMarket.length).toEqual(2);
      expect(records.forkingMarket[0].universe).toEqual("0x000000000000000000000000000000000000000b");
      expect(records.forkingMarket[0].marketId).toEqual("0x0000000000000000000000000000000000000211");
      expect(records.forkingMarket[0].forking).toEqual(1);
      // Pre-existing hard-coded forked market
      expect(records.forkingMarket[1].universe).toEqual("0x000000000000000000000000000000000000000b");
      expect(records.forkingMarket[1].marketId).toEqual("0x00000000000000000000000000000000000000f1");
      expect(records.forkingMarket[1].forking).toEqual(1);
      expect(records.otherMarket[0].needsDisavowal).toEqual(1);
      expect(records.universe[0].forked).toEqual(1);

      await processUniverseForkedLogRemoval(trx, augur, log);
      const recordsAfterRemoval = await getForkRows(trx, log);
      expect(recordsAfterRemoval.forkingMarket.length).toEqual(1);
      expect(recordsAfterRemoval.forkingMarket[0].universe).toEqual("0x000000000000000000000000000000000000000b");
      expect(recordsAfterRemoval.forkingMarket[0].marketId).toEqual("0x00000000000000000000000000000000000000f1");
      expect(recordsAfterRemoval.forkingMarket[0].forking).toEqual(1);
      expect(recordsAfterRemoval.otherMarket[0].needsDisavowal).toEqual(0);
      expect(recordsAfterRemoval.universe[0].forked).toEqual(0);
    });
  });

  afterEach(async () => {
    await db.destroy();
  });

});
