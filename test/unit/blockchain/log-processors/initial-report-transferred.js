const Augur = require("augur.js");

const setupTestDb = require("../../test.database");
const { processInitialReporterTransferredLog, processInitialReporterTransferredLogRemoval } = require("src/blockchain/log-processors/initial-report-transferred");

function getInitialReport(db, log) {
  return db("initial_reports").first(["reporter"]).where("initial_reports.marketId", log.market);
}

const augur = {
  constants: new Augur().constants,
};
describe("blockchain/log-processors/initial-report-transferred", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const log = {
    market: "0x0000000000000000000000000000000000000011",
    from: "0x0000000000000000000000000000000000000b0b",
    to: "0x0000000000000000000000000000000000000d0d",
  };
  test("Initial report transferred", async () => {
    return db.transaction(async (trx) => {
      await processInitialReporterTransferredLog(trx, augur, log);
      await expect(getInitialReport(trx, log)).resolves.toEqual({
        reporter: "0x0000000000000000000000000000000000000d0d",
      });

      await processInitialReporterTransferredLogRemoval(trx, augur, log);
      await expect(getInitialReport(trx, log)).resolves.toEqual({
        reporter: "0x0000000000000000000000000000000000000b0b",
      });
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
});