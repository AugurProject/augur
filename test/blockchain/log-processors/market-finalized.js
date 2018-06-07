"use strict";

const Augur = require("augur.js");
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {BigNumber} = require("bignumber.js");
const {processMarketFinalizedLog, processMarketFinalizedLogRemoval} = require("../../../build/blockchain/log-processors/market-finalized");
const {getMarketsWithReportingState} = require("../../../build/server/getters/database");
const {parallel} = require("async");

const getMarketState = (db, params, callback) => {
  parallel({
    market: (next) => getMarketsWithReportingState(db, ["markets.marketId", "market_state.reportingState", "marketCreatorFeesBalance"]).first().where({"markets.marketId": params.log.market}).asCallback(next),
    winningPayout: (next) => db("payouts").where({marketId: params.log.market, "winning": 1}).first().asCallback(next),
  }, callback);
};

describe("blockchain/log-processors/market-finalized", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          processMarketFinalizedLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getMarketState(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processMarketFinalizedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.ifError(err);
                getMarketState(trx, t.params, (err, records) => {
                  t.assertions.onRemoved(err, records);
                  db.destroy();
                  done();
                });
              });
            });
          });
        });
      });
    });
  };
  const constants = new Augur().constants;
  test({
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
              assert.deepEqual(p, ["0xbbb0000000000000000000000000000000000013", "latest"]);
              callback(null, "0x91f");
            },
          },
        },
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, {
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
        assert.ifError(err);
        assert.deepEqual(records, {
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
