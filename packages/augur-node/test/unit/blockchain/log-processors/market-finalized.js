"use strict";

const Augur = require("augur.js");
const setupTestDb = require("../../test.database");
const {BigNumber} = require("bignumber.js");
const {processMarketFinalizedLog, processMarketFinalizedLogRemoval} = require("src/blockchain/log-processors/market-finalized");
const {getMarketsWithReportingState} = require("src/server/getters/database");
const {series} = require("async");

const getMarketState = (db, params, callback) => {
  series({
    market: (next) => getMarketsWithReportingState(db, ["markets.marketId", "market_state.reportingState", "marketCreatorFeesBalance"]).first().where({"markets.marketId": params.log.market}).asCallback(next),
    winningPayout: (next) => db("payouts").where({marketId: params.log.market, "winning": 1}).first().asCallback(next),
  }, callback);
};

describe("blockchain/log-processors/market-finalized", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
const db = await setupTestDb();
      db.transaction((trx) => {
        processMarketFinalizedLog(trx, t.params.augur, t.params.log, (err) => {
          expect(err).toBeFalsy();
          getMarketState(trx, t.params, (err, records) => {
            t.assertions.onAdded(err, records);
            processMarketFinalizedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
              expect(err).toBeFalsy();
              getMarketState(trx, t.params, (err, records) => {
                t.assertions.onRemoved(err, records);
                db.destroy();
                done();
              });
            });
          });
        });
      });
    })
  };
  const constants = new Augur().constants;
  runTest({
    description: "yesNo market MarketFinalized log and removal",
    params: {
      log: {
        market: "0x0000000000000000000000000000000000000013",
        universe: "0x000000000000000000000000000000000000000b",
        blockNumber: 1400001,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
        logIndex: 0,
      },
      augur: {
        constants: constants,
        rpc: {
          eth: {
            getBalance: (p, callback) => {
              expect(p).toEqual(["0xbbb0000000000000000000000000000000000013", "latest"]);
              callback(null, "0x91f");
            },
          },
        },
      },
    },
    assertions: {
      onAdded: (err, records) => {
        expect(err).toBeFalsy();
        expect(records).toEqual({
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
      },
      onRemoved: (err, records) => {
        expect(err).toBeFalsy();
        expect(records).toEqual({
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
      },
    },
  });
});
