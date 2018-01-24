"use strict";

const Augur = require("augur.js");
const assert = require("chai").assert;
const { parallel } = require("async");
const setupTestDb = require("../../test.database");
const { processMarketFinalizedLog, processMarketFinalizedLogRemoval } = require("../../../build/blockchain/log-processors/market-finalized");
const { getMarketsWithReportingState } = require("../../../build/server/getters/database");

describe("blockchain/log-processors/market-finalized", () => {
  const test = (t) => {
    const getMarketState = (db, params, callback) => getMarketsWithReportingState(db, ["markets.marketID", "market_state.reportingState"]).first().where({"markets.marketID": params.log.market }).asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processMarketFinalizedLog(db, t.params.augur, trx, t.params.log, (err) => {
            assert.isNull(err);
            getMarketState(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processMarketFinalizedLogRemoval(db, t.params.augur, trx, t.params.log, (err) => {
                getMarketState(trx, t.params, (err, records) => {
                  t.assertions.onRemoved(err, records);
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
    description: "binary market MarketFinalized log and removal",
    params: {
      log: {
        market: "0x0000000000000000000000000000000000000013",
        blockNumber: 1400001,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
        logIndex: 0,
      },
      augur: {
        constants: new Augur().constants,
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          marketID: "0x0000000000000000000000000000000000000013",
          reportingState: "FINALIZED",
        });
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          marketID: "0x0000000000000000000000000000000000000013",
          reportingState: "AWAITING_FINALIZATION",
        });
      },
    }
  });
});
