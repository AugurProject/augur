import { setupTestDb } from 'test/unit/test.database';

import {
  processMarketParticipantsDisavowedLog,
  processMarketParticipantsDisavowedLogRemoval,
} from './market-participants-disavowed';

function getMarketCrowdsourcers(db, log) {
  return db("crowdsourcers").where({ marketId: log.market });
}

describe("blockchain/log-processors/market-participants-disavowed", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const log = {
    market: "0x0000000000000000000000000000000000000011",
  };
  test("Market Participants Disavowed", async () => {
    return db.transaction(async (trx) => {
      await(await processMarketParticipantsDisavowedLog({}, log))(trx);

      const records = await getMarketCrowdsourcers(trx, log);
      expect(records.length).toEqual(3);
      expect(records[0].disavowed).toEqual(1);
      expect(records[1].disavowed).toEqual(1);
      expect(records[2].disavowed).toEqual(1);
      await(await processMarketParticipantsDisavowedLogRemoval({}, log))(trx);

      const recordsAfterRemoval = await getMarketCrowdsourcers(trx, log);
      expect(recordsAfterRemoval.length).toEqual(3);
      expect(recordsAfterRemoval[0].disavowed).toEqual(0);
      expect(recordsAfterRemoval[1].disavowed).toEqual(0);
      expect(recordsAfterRemoval[2].disavowed).toEqual(0);
    });
  });

  afterEach(async () => {
    await db.destroy();
  });

});
