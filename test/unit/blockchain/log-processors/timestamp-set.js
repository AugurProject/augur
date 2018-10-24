const setupTestDb = require("../../test.database");
const { processTimestampSetLog, processTimestampSetLogRemoval } = require("src/blockchain/log-processors/timestamp-set");
const { getOverrideTimestamp } = require("src/blockchain/process-block");

function initializeNetwork(db) {
  return db.insert({ networkId: 9999 }).into("network_id");
}

function getTimestampState(db) {
  return db.select("overrideTimestamp").from("network_id").first();
}

describe("blockchain/log-processors/timestamp-set", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
    await initializeNetwork(db);
  });

  const log1 = {
    blockNumber: 1400002,
    newTimestamp: 919191,
  };
  const log2 = {
    blockNumber: 1400001,
    newTimestamp: 828282,
  };
  test("set timestamp", async () => {
    return db.transaction(async (trx) => {
      await processTimestampSetLog(trx, {}, log1);
      expect(getOverrideTimestamp()).toEqual(919191);
      await expect(getTimestampState(trx)).resolves.toEqual({
        overrideTimestamp: 919191,
      });

      await processTimestampSetLog(trx, {}, log2);
      expect(getOverrideTimestamp()).toEqual(828282);
      await expect(getTimestampState(trx)).resolves.toEqual({
        overrideTimestamp: 828282,
      });

      await processTimestampSetLogRemoval(trx, {}, log2);
      expect(getOverrideTimestamp()).toEqual(919191);
      await expect(getTimestampState(trx)).resolves.toEqual({
        overrideTimestamp: 919191,
      });

      await expect(processTimestampSetLogRemoval(trx, {}, log1)).rejects.toEqual(new Error("Timestamp removal failed 919191 919191"));
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
})
;
