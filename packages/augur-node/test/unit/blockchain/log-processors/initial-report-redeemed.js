const Augur = require("augur.js");

const setupTestDb = require("../../test.database");
const { processInitialReporterRedeemedLog, processInitialReporterRedeemedLogRemoval } = require("src/blockchain/log-processors/initial-report-redeemed");
const augur = new Augur();

function getInitialReport(db, log) {
  return db("initial_reports").first(["redeemed"]).where("initial_reports.marketId", log.market);
}
describe("blockchain/log-processors/initial-report-redeemed", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const log = {
    universe: "0x000000000000000000000000000000000000000b",
    reporter: "0x0000000000000000000000000000000000000b0b",
    market: "0x0000000000000000000000000000000000000011",
    amountRedeemed: 42,
    repReceived: 63,
    reportingFeesReceived: 1,
    payoutNumerators: [0, 1],
  };
  test("Initial report redeemed", async () => {
    return db.transaction(async (trx) => {
      await(await processInitialReporterRedeemedLog(augur, log))(trx);
      await expect(getInitialReport(trx, log)).resolves.toEqual({
        redeemed: 1,
      });

      await(await processInitialReporterRedeemedLogRemoval(augur, log))(trx);
      await expect(getInitialReport(trx, log)).resolves.toEqual({
        redeemed: 0,
      });
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
});
