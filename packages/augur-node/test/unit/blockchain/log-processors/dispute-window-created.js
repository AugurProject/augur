const setupTestDb = require("../../test.database");
const { processDisputeWindowCreatedLog, processDisputeWindowCreatedLogRemoval } = require("src/blockchain/log-processors/dispute-window-created");

async function getDisputeWindow(db, log) {
  return {
    dispute_windows: await db("dispute_windows").first(["disputeWindow", "disputeWindowId", "endTime"]).where({ disputeWindow: log.disputeWindow }),
  };
}

describe("blockchain/log-processors/dispute-window-created", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  test("reporting window created", async () => {
    return db.transaction(async (trx) => {
      const log = {
        universe: "0x000000000000000000000000000000000000000b",
        disputeWindow: "0xf000000000000000000000000000000000000000",
        startTime: 1510065473,
        endTime: 1512657473,
        id: 40304,
        blockNumber: 160101,
      };
      await(await processDisputeWindowCreatedLog(null, log))(trx);
      expect(await getDisputeWindow(trx, log)).toEqual({
        dispute_windows: {
          endTime: 1512657473,
          disputeWindow: "0xf000000000000000000000000000000000000000",
          disputeWindowId: 40304,
        },
      });
      await(await processDisputeWindowCreatedLogRemoval(null, log))(trx);
      expect(await getDisputeWindow(trx, log)).toEqual({
        dispute_windows: undefined,
      });
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
});
