import { setupTestDb } from 'test/unit/test.database';
import { processTimestampSetLog, processTimestampSetLogRemoval } from './timestamp-set';
import { getOverrideTimestamp } from 'src/blockchain/process-block';

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
      await(await processTimestampSetLog({}, log1))(trx);
      expect(getOverrideTimestamp()).toEqual(919191);
      await expect(getTimestampState(trx)).resolves.toEqual({
        overrideTimestamp: 919191,
      });

      await(await processTimestampSetLog({}, log2))(trx);
      expect(getOverrideTimestamp()).toEqual(828282);
      await expect(getTimestampState(trx)).resolves.toEqual({
        overrideTimestamp: 828282,
      });

      await(await processTimestampSetLogRemoval({}, log2))(trx);
      expect(getOverrideTimestamp()).toEqual(919191);
      await expect(getTimestampState(trx)).resolves.toEqual({
        overrideTimestamp: 919191,
      });

      await expect((await processTimestampSetLogRemoval({}, log1))((trx))).rejects.toEqual(new Error("Timestamp removal failed 919191 919191"));
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
})
;
