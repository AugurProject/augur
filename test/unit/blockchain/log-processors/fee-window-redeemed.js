const setupTestDb = require("../../test.database");
const { processFeeWindowRedeemedLog, processFeeWindowRedeemedLogRemoval } = require("src/blockchain/log-processors/fee-window-redeemed");

function getRedeemed(db) {
  return db.select(["reporter", "feeWindow", "amountRedeemed", "reportingFeesReceived"]).from("participation_token_redeemed");
}

describe("blockchain/log-processors/fee-window-redeemed", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const log = {
    transactionHash: "TRANSACTION_HASH",
    logIndex: 0,
    blockNumber: 1400101,
    reporter: "REPORTER",
    feeWindow: "FEE_WINDOW",
    amountRedeemed: "200",
    reportingFeesReceived: "900",
  };
  test("Redeemed", async () => {
    return db.transaction(async (trx) => {
      await(await processFeeWindowRedeemedLog({}, log))(trx);
      await expect(getRedeemed(trx)).resolves.toEqual([{
        amountRedeemed: "200",
        feeWindow: "FEE_WINDOW",
        reporter: "REPORTER",
        reportingFeesReceived: "900",
      }]);
      await(await processFeeWindowRedeemedLogRemoval({}, log))(trx);
      await expect(getRedeemed(trx)).resolves.toEqual([]);
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
});
