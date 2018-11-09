const setupTestDb = require("../../test.database");
const { processCompleteSetsPurchasedOrSoldLog, processCompleteSetsPurchasedOrSoldLogRemoval } = require("src/blockchain/log-processors/completesets");
const Augur = require("augur.js");
const augur = new Augur();

function getState(db, log) {
  return db("completeSets").where({
    account: log.account,
    marketId: log.market,
  });
}

describe("blockchain/log-processors/completesets", () => {
  let spy;
  beforeAll(() => {
    jest.spyOn(augur.rpc, 'getNetworkID').mockImplementation(() => 1);
  });

  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const log = {
    universe: "0x0000000000000000000000000000000000000001",
    market: "0x0000000000000000000000000000000000000002",
    account: "0x0000000000000000000000000000000000000b0b",
    numCompleteSets: "200000000000000",
    numPurchasedOrSold: "200000000000000",
    eventName: "CompleteSetsPurchased",
    blockNumber: 437,
    transactionHash: "0x00000000000000000000000000000000deadbeef",
    logIndex: 0,
    tradeGroupId: 12,
  };
  test("CompleteSetsPurchased log and removal", async () => {
    return db.transaction(async (trx) => {
      await processCompleteSetsPurchasedOrSoldLog(trx, augur, log);
      expect(getState(trx, log)).resolves.toEqual([{
        account: "0x0000000000000000000000000000000000000b0b",
        blockNumber: 437,
        logIndex: 0,
        eventName: "CompleteSetsPurchased",
        marketId: "0x0000000000000000000000000000000000000002",
        numCompleteSets: "2",
        numPurchasedOrSold: "2",
        tradeGroupId: 12,
        transactionHash: "0x00000000000000000000000000000000deadbeef",
        universe: "0x0000000000000000000000000000000000000001",
      }]);
      await processCompleteSetsPurchasedOrSoldLogRemoval(trx, augur, log);
      expect(await getState(trx, log)).toEqual([]);
    });
  });

  afterEach(async () => {
    await db.destroy();
  });

  afterAll(() => {
    spy.mockRestore();
  });
});
