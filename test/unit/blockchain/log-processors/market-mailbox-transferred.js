const setupTestDb = require("../../test.database");
const { processMarketMailboxTransferredLog, processMarketMailboxTransferredLogRemoval } = require("src/blockchain/log-processors/market-mailbox-transferred");

function getMarket(db, log) {
  return db.select(["markets.marketId", "markets.marketCreatorMailboxOwner"]).from("markets").where({ "markets.marketId": log.market });
}
describe("blockchain/log-processors/market-mailbox-transferred", () => {
  let db;
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
