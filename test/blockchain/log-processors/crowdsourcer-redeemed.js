"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {processDisputeCrowdsourcerRedeemedLog, processDisputeCrowdsourcerRedeemedLogRemoval} = require("../../../build/blockchain/log-processors/crowdsourcer");

describe("blockchain/log-processors/crowdsourcer-redeemed", () => {
  const test = (t) => {
    const getRedeemed = (db, params, callback) => db.select(["reporter", "crowdsourcer", "amountRedeemed", "repReceived", "reportingFeesReceived"]).from("crowdsourcer_redeemed").asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          processDisputeCrowdsourcerRedeemedLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getRedeemed(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processDisputeCrowdsourcerRedeemedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.ifError(err);
                getRedeemed(trx, t.params, (err, records) => {
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
  test({
    description: "Redeemed",
    params: {
      log: {
        transactionHash: "TRANSACTION_HASH",
        logIndex: 0,
        blockNumber: 1400101,
        reporter: "REPORTER",
        disputeCrowdsourcer: "DISPUTE_CROWDSOURCER",
        amountRedeemed: "200",
        repReceived: "400",
        reportingFeesReceived: "900",
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, [{
          amountRedeemed: "200",
          crowdsourcer: "DISPUTE_CROWDSOURCER",
          repReceived: "400",
          reporter: "REPORTER",
          reportingFeesReceived: "900",
        }]);
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, []);
      },
    },
  });
});
