"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { processDisputeCrowdsourcerCreatedLog, processDisputeCrowdsourcerCreatedLogRemoval,
  processDisputeCrowdsourcerContributionLog, processDisputeCrowdsourcerContributionLogRemoval,
  processDisputeCrowdsourcerCompletedLog, processDisputeCrowdsourcerCompletedLogRemoval }
  = require("../../../build/blockchain/log-processors/crowdsourcer");

const getCrowdsourcer = (db, params, callback) => {
  db("crowdsourcers").first(
    ["crowdSourcerID",
      "crowdsourcers.marketID",
      "completed",
      "feeWindow",
      "payouts.winning",
      "payouts.tentativeWinning"])
    .join("payouts", "payouts.payoutID", "crowdsourcers.payoutID")
    .where({crowdsourcerID: params.log.disputeCrowdsourcer}).asCallback(callback);
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
          function verify(processor, getter, checker, callback) {
            processor(trx, t.params.augur, t.params.log, (err) => {
              assert.isNull(err);
              getter(trx, t.params, (err, records) => {
                assert.isNull(err);
                checker(err, records);
                callback();
              });
            });
          }
          verify(processDisputeCrowdsourcerCreatedLog, getCrowdsourcer, t.assertions.onCreated, () => {
            verify(processDisputeCrowdsourcerContributionLog, getDisputesFromCrowdsourcer, t.assertions.onContributed, () => {
              verify(processDisputeCrowdsourcerCompletedLog, getCrowdsourcer, t.assertions.onCompleted, () => {
                verify(processDisputeCrowdsourcerCompletedLogRemoval, getCrowdsourcer, t.assertions.onCompletedRemoved, () => {
                  verify(processDisputeCrowdsourcerContributionLogRemoval, getDisputesFromCrowdsourcer, t.assertions.onContributedRemoved, () => {
                    verify(processDisputeCrowdsourcerCreatedLogRemoval, getCrowdsourcer, t.assertions.onCreatedRemoved, () => {
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
  };
  test({
    description: "report submitted",
    params: {
      log: {
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x0000000000000000000000000000000000000001",
        disputeCrowdsourcer: "0x0000000000000000002000000000000000000001",
        reporter: "0x0000000000000000000000000000000000000b0b",
        size: 20000,
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
          crowdsourcerID: "0x0000000000000000002000000000000000000001",
          marketID: "0x0000000000000000000000000000000000000001",
          feeWindow: "0x2000000000000000000000000000000000000000",
          completed: null,
          tentativeWinning: 0,
          winning: null,
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
          disputeID: 8,
          crowdsourcerID: "0x0000000000000000002000000000000000000001",
          reporter: "0x0000000000000000000000000000000000000b0b",
          amountStaked: 19381,
        }]);
      },
      onContributedRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, []);
      },
      onCompleted: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          crowdsourcerID: "0x0000000000000000002000000000000000000001",
          marketID: "0x0000000000000000000000000000000000000001",
          feeWindow: "0x2000000000000000000000000000000000000000",
          completed: 1,
          tentativeWinning: 1,
          winning: null,
        });
      },
      onCompletedRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          crowdsourcerID: "0x0000000000000000002000000000000000000001",
          marketID: "0x0000000000000000000000000000000000000001",
          feeWindow: "0x2000000000000000000000000000000000000000",
          completed: null,
          tentativeWinning: 0,
          winning: null,
        });
      },
    },
  });
});
