const Augur = require("augur.js");
const setupTestDb = require("../../test.database");
const { BigNumber } = require("bignumber.js");
const { processMarketFinalizedLog, processMarketFinalizedLogRemoval } = require("src/blockchain/log-processors/market-finalized");
const { getMarketsWithReportingState } = require("src/server/getters/database");

async function getMarketState(db, log) {
  return {
    market: await getMarketsWithReportingState(db, ["markets.marketId", "market_state.reportingState", "marketCreatorFeesBalance"]).first().where({ "markets.marketId": log.market }),
    winningPayout: await db("payouts").where({ marketId: log.market, "winning": 1 }).first(),
  };
}
const augur = {
  constants: new Augur().constants,
  rpc: {
    eth: {
      getBalance: (p, callback) => {
        expect(p).toEqual(["0xbbb0000000000000000000000000000000000013", "latest"]);
        callback(null, "0x91f");
      },
    },
  },
};

describe("blockchain/log-processors/market-finalized", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const log = {
    market: "0x0000000000000000000000000000000000000013",
    universe: "0x000000000000000000000000000000000000000b",
    blockNumber: 1400001,
    transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
    logIndex: 0,
  };

  test("yesNo market MarketFinalized log and removal", async () => {
    return db.transaction(async (trx) => {
      await(await processMarketFinalizedLog(augur, log))(trx);
      await expect(getMarketState(trx, log)).resolves.toEqual({
        market: {
          marketId: "0x0000000000000000000000000000000000000013",
          reportingState: "FINALIZED",
          marketCreatorFeesBalance: new BigNumber("0x91f", 16),
        },
        winningPayout: {
          "isInvalid": 0,
          "marketId": "0x0000000000000000000000000000000000000013",
          "payout0": new BigNumber(0),
          "payout1": new BigNumber(10000),
          "payout2": null,
          "payout3": null,
          "payout4": null,
          "payout5": null,
          "payout6": null,
          "payout7": null,
          "payoutId": 8,
          "tentativeWinning": 1,
          "winning": 1,
        },
      });

      await(await processMarketFinalizedLogRemoval(augur, log))(trx);
      await expect(getMarketState(trx, log)).resolves.toEqual({
        market: {
          marketId: "0x0000000000000000000000000000000000000013",
          reportingState: "AWAITING_FINALIZATION",
          marketCreatorFeesBalance: new BigNumber("0x91f", 16),
        },
        winningPayout: {
          "isInvalid": 0,
          "marketId": "0x0000000000000000000000000000000000000013",
          "payout0": new BigNumber(0),
          "payout1": new BigNumber(10000),
          "payout2": null,
          "payout3": null,
          "payout4": null,
          "payout5": null,
          "payout6": null,
          "payout7": null,
          "payoutId": 8,
          "tentativeWinning": 1,
          "winning": 1,
        },
      });
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
});
