const setupTestDb = require("../../test.database");
const { processDisputeCrowdsourcerRedeemedLog, processDisputeCrowdsourcerRedeemedLogRemoval } = require("src/blockchain/log-processors/crowdsourcer");

function getRedeemed(db) {
  return db.select(["reporter", "crowdsourcer", "amountRedeemed", "repReceived", "reportingFeesReceived"]).from("crowdsourcer_redeemed");
}

describe("blockchain/log-processors/crowdsourcer-redeemed", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const log = {
    transactionHash: "TRANSACTION_HASH",
    logIndex: 0,
    blockNumber: 1400101,
    reporter: "REPORTER",
    disputeCrowdsourcer: "DISPUTE_CROWDSOURCER",
    amountRedeemed: "200",
    repReceived: "400",
    reportingFeesReceived: "900",
  };
  test("Redeemed", async () => {
    return db.transaction(async (trx) => {
      await(await processDisputeCrowdsourcerRedeemedLog({}, log))(trx);

      await expect(getRedeemed(trx)).resolves.toEqual([{
        amountRedeemed: "200",
        crowdsourcer: "DISPUTE_CROWDSOURCER",
        repReceived: "400",
        reporter: "REPORTER",
        reportingFeesReceived: "900",
      }]);
      await(await processDisputeCrowdsourcerRedeemedLogRemoval({}, log))(trx);

      await expect(getRedeemed(trx)).resolves.toEqual([]);
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
});
