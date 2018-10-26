const Augur = require("augur.js");

const { BigNumber } = require("bignumber.js");
const setupTestDb = require("../../test.database");
const { processInitialReportSubmittedLog, processInitialReportSubmittedLogRemoval } = require("src/blockchain/log-processors/initial-report-submitted");
const { setOverrideTimestamp, removeOverrideTimestamp } = require("src/blockchain/process-block");

function getReportingState(db, log) {
  return db("markets").first(["reportingState", "initialReportSize", "marketCreatorFeesBalance"]).where("markets.marketId", log.market).join("market_state", "market_state.marketStateId", "markets.marketStateId");
}
function getInitialReport(db, log) {
  return db("initial_reports").first(["reporter", "amountStaked", "initialReporter"]).where("initial_reports.marketId", log.market);
}
const augur = {
  constants: new Augur().constants,
  api: {
    Market: {
      getInitialReporter: () => Promise.resolve("0x0000000000000000000000000000000000abe123"),
    },
    Universe: {
      getFeeWindowByTimestamp: (p) => {
        expect(p.tx.to).toBe("0x000000000000000000000000000000000000000b");
        const feeWindowByTimestamp = {
          1509085473: "0x2000000000000000000000000000000000000000",
          1509690273: "0x2100000000000000000000000000000000000000",
        };
        const feeWindow = feeWindowByTimestamp[p._timestamp];
        expect(typeof feeWindow).toBe("string");
        return Promise.resolve(feeWindow);
      },
    },
  },
  rpc: {
    eth: {
      getBalance: (p, callback) => {
        expect(p).toEqual(["0xbbb0000000000000000000000000000000000001", "latest"]);
        callback(null, "0x22");
      },
    },
  },
};

describe("blockchain/log-processors/initial-report-submitted", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const log = {
    universe: "0x000000000000000000000000000000000000000b",
    market: "0x0000000000000000000000000000000000000001",
    stakeToken: "0x1000000000000000000000000000000000000000",
    reporter: "0x0000000000000000000000000000000000000b0b",
    isDesignatedReporter: true,
    payoutNumerators: [0, 1],
    invalid: false,
    blockNumber: 1500001,
    amountStaked: "2829",
    transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
    logIndex: 0,
  };
  test("Initial report submitted", async () => {
    return db.transaction(async (trx) => {
      const overrideTimestamp = 1509085473;
      await setOverrideTimestamp(trx, overrideTimestamp);

      await(await processInitialReportSubmittedLog(augur, log))(trx);
      await expect(getReportingState(trx, log)).resolves.toEqual({
        initialReportSize: new BigNumber("2829", 10),
        reportingState: "AWAITING_NEXT_WINDOW",
        marketCreatorFeesBalance: new BigNumber("0x22", 16),
      });
      await expect(getInitialReport(trx, log)).resolves.toEqual({
        reporter: "0x0000000000000000000000000000000000000b0b",
        amountStaked: new BigNumber("2829", 10),
        initialReporter: "0x0000000000000000000000000000000000abe123",
      });

      await(await processInitialReportSubmittedLogRemoval(augur, log))(trx);
      await expect(getReportingState(trx, log)).resolves.toEqual({
        initialReportSize: null,
        reportingState: "DESIGNATED_REPORTING",
        marketCreatorFeesBalance: new BigNumber("0x22", 16),
      });
      await expect(removeOverrideTimestamp(trx, overrideTimestamp)).rejects.toEqual(new Error("Timestamp removal failed 1509085473 1509085473"));
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
});
