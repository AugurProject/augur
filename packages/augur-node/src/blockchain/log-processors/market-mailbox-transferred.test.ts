import { setupTestDb } from 'test/unit/test.database';

import {
  processMarketMailboxTransferredLog,
  processMarketMailboxTransferredLogRemoval,
} from './market-mailbox-transferred';
import Knex from "knex";

function getMarket(db:Knex, log:Log) {
  return db.select(["markets.marketId", "markets.marketCreatorMailboxOwner"]).from("markets").where({ "markets.marketId": log.market });
}
describe("blockchain/log-processors/market-mailbox-transferred", () => {
  let db:Knex;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const log = {
    market: "0x0000000000000000000000000000000000000211",
    blockNumber: 1400001,
    transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
    logIndex: 0,
    from: "0x0000000000000000000000000000000000000b0b",
    to: "0x000000000000000000000000000000000000d00d",
  };
  test("Transfer MarketMailbox log and removal", async () => {
    return db.transaction(async (trx) => {
      await(await processMarketMailboxTransferredLog({}, log))(trx);

      await expect(getMarket(trx, log)).resolves.toEqual([
        {
          "marketId": "0x0000000000000000000000000000000000000211",
          "marketCreatorMailboxOwner": "0x000000000000000000000000000000000000d00d",
        },
      ]);
      await(await processMarketMailboxTransferredLogRemoval({}, log))(trx);

      await expect(getMarket(trx, log)).resolves.toEqual([
        {
          "marketId": "0x0000000000000000000000000000000000000211",
          "marketCreatorMailboxOwner": "0x0000000000000000000000000000000000000b0b",
        },
      ]);
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
});
