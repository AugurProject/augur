const setupTestDb = require("../../test.database");
const { processFeeWindowCreatedLog, processFeeWindowCreatedLogRemoval } = require("src/blockchain/log-processors/fee-window-created");

async function getFeeWindow(db, log) {
  return {
    fee_windows: await db("fee_windows").first(["feeWindow", "feeWindowId", "endTime"]).where({ feeWindow: log.feeWindow }),
    tokens: await db("tokens").select(["contractAddress", "symbol", "feeWindow"])
      .where("contractAddress", log.feeWindow)
      .orWhere("feeWindow", log.feeWindow),
  };
}
const augur = {
  api: {
    FeeWindow: {
      getFeeToken: () => Promise.resolve("FEE_TOKEN"),
    },
  },
};

describe("blockchain/log-processors/fee-window-created", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  test("reporting window created", async () => {
    return db.transaction(async (trx) => {
      const log = {
        universe: "0x000000000000000000000000000000000000000b",
        feeWindow: "0xf000000000000000000000000000000000000000",
        startTime: 1510065473,
        endTime: 1512657473,
        id: 40304,
        blockNumber: 160101,
      };
      await(await processFeeWindowCreatedLog(augur, log))(trx);
      expect(await getFeeWindow(trx, log)).toEqual({
        fee_windows: {
          endTime: 1512657473,
          feeWindow: "0xf000000000000000000000000000000000000000",
          feeWindowId: 40304,
        },
        tokens: [
          {
            contractAddress: "0xf000000000000000000000000000000000000000",
            symbol: "ParticipationToken",
            feeWindow: null,
          },
          {
            contractAddress: "FEE_TOKEN",
            symbol: "FeeToken",
            feeWindow: "0xf000000000000000000000000000000000000000",
          },
        ],
      });
      await(await processFeeWindowCreatedLogRemoval(augur, log))(trx);
      expect(await getFeeWindow(trx, log)).toEqual({
        fee_windows: undefined,
        tokens: [],
      });
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
});
