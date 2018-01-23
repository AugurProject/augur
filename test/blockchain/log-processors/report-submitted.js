"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { processDisputeCrowdsourcerCreatedLog, processDisputeCrowdsourcerCreatedLogRemoval,
  processDisputeCrowdsourcerContributionLog, processDisputeCrowdsourcerContributionLogRemoval }
  = require("../../../build/blockchain/log-processors/crowdsourcer");
// processDisputeCrowdsourcerCompletedLog, processDisputeCrowdsourcerCompletedLogRemoval

const getMarketFromCrowdsourcer = (db, params, callback) => {
  db("crowdsourcers").first(["marketID"]).where({crowdsourcerID: params.log.disputeCrowdsourcer}).asCallback(callback);
};

const getDisputesFromCrowdsourcer = (db, params, callback) => {
  db("disputes").where({crowdsourcerID: params.log.disputeCrowdsourcer}).asCallback(callback);
};

describe("blockchain/log-processors/crowdsourcers", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processDisputeCrowdsourcerCreatedLog(db, t.params.augur, trx, t.params.log, (err) => {
            assert.isNull(err);
            getMarketFromCrowdsourcer(trx, t.params, (err, records) => {
              assert.isNull(err);
              t.assertions.onCreated(err, records);
              processDisputeCrowdsourcerContributionLog(db, t.params.augur, trx, t.params.log, (err) => {
                assert.isNull(err);
                getDisputesFromCrowdsourcer(trx, t.params, (err, records) => {
                  t.assertions.onContributed(err, records);
                  processDisputeCrowdsourcerContributionLogRemoval(db, t.params.augur, trx, t.params.log, (err) => {
                    assert.isNull(err);
                    getDisputesFromCrowdsourcer(trx, t.params, (err, records) => {
                      t.assertions.onContributedRemoved(err, records);
                      processDisputeCrowdsourcerCreatedLogRemoval(db, t.params.augur, trx, t.params.log, (err) => {
                        assert.isNull(err);
                        getMarketFromCrowdsourcer(trx, t.params, (err, records) => {
                          t.assertions.onCreatedRemoved(err, records);
                          done();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  };
  test({
    description: "report submitted",
    params: {
      log: {
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x0000000000000000000000000000000000000001",
        disputeCrowdsourcer: "0x0000000000000000002000000000000000000001",
        reporter: "0x0000000000000000000000000000000000000b0b",
        amountStaked: 19381,
        payoutNumerators: [0, 1],
        invalid: false,
        blockNumber: 1400100,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
        logIndex: 0,
      },
    },
    assertions: {
      onCreated: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          marketID: "0x0000000000000000000000000000000000000001",
        });
      },
      onCreatedRemoved: (err, records) => {
        assert.isNull(err);
        assert.isUndefined(records);
      },
      onContributed: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, [{
          blockNumber: 1400100,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
          logIndex: 0,
          disputeID: 7,
          crowdsourcerID: "0x0000000000000000002000000000000000000001",
          reporter: "0x0000000000000000000000000000000000000b0b",
          amountStaked: 19381,
          claimed: 0,
        }]);
      },
      onContributedRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, []);
      },
    },
  });
});
