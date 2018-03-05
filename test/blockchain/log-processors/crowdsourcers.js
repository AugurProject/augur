"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { processDisputeCrowdsourcerCreatedLog, processDisputeCrowdsourcerCreatedLogRemoval,
  processDisputeCrowdsourcerContributionLog, processDisputeCrowdsourcerContributionLogRemoval,
  processDisputeCrowdsourcerCompletedLog, processDisputeCrowdsourcerCompletedLogRemoval }
  = require("../../../build/blockchain/log-processors/crowdsourcer");
const { getMarketsWithReportingState }  = require("../../../build/server/getters/database");

const getCrowdsourcer = (db, params, callback) => {
  db("crowdsourcers").first(
    ["crowdSourcerId",
      "crowdsourcers.marketId",
      "completed",
      "feeWindow",
      "payouts.winning",
      "payouts.tentativeWinning"])
    .join("payouts", "payouts.payoutId", "crowdsourcers.payoutId")
    .where({crowdsourcerId: params.log.disputeCrowdsourcer}).asCallback(callback);
};

const getDisputesFromCrowdsourcer = (db, params, callback) => {
  db("disputes").where({crowdsourcerId: params.log.disputeCrowdsourcer}).asCallback(callback);
};

const getCrowdsourcerAndMarket  = (db, params, callback) => {
  getCrowdsourcer(db, params, (err, crowdsourcer) => {
    if (err) return callback(err);

    getMarketsWithReportingState(db).first().where({ "markets.marketId": crowdsourcer.marketId })
      .asCallback((err, market) => {
        if (err) return callback(err);

        callback(null, { market, crowdsourcer });
      });
  });
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
              verify(processDisputeCrowdsourcerCompletedLog, getCrowdsourcerAndMarket, t.assertions.onCompleted, () => {
                verify(processDisputeCrowdsourcerCompletedLogRemoval, getCrowdsourcerAndMarket, t.assertions.onCompletedRemoved, () => {
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
          crowdsourcerId: "0x0000000000000000002000000000000000000001",
          marketId: "0x0000000000000000000000000000000000000001",
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
          disputeId: 8,
          crowdsourcerId: "0x0000000000000000002000000000000000000001",
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
        assert.deepEqual(records.crowdsourcer, {
          crowdsourcerId: "0x0000000000000000002000000000000000000001",
          marketId: "0x0000000000000000000000000000000000000001",
          feeWindow: "0x2000000000000000000000000000000000000000",
          completed: 1,
          tentativeWinning: 1,
          winning: null,
        });

        assert.deepEqual(records.market, {
          category: "test category",
          consensusPayoutId: null,
          creationBlockNumber: 1400000,
          creationFee: 10,
          creationTime: 1506473474,
          designatedReportStake: 10,
          designatedReporter: "0x0000000000000000000000000000000000000b0b",
          endTime: 1506573470,
          feeWindow: "0x1000000000000000000000000000000000000000",
          finalizationTime: null,
          initialReportSize: null,
          isInvalid: null,
          longDescription: null,
          marketCreator: "0x0000000000000000000000000000000000000b0b",
          marketCreatorFeeRate: 0.01,
          marketCreatorFeesClaimed: 0,
          marketCreatorFeesCollected: 0,
          marketId: "0x0000000000000000000000000000000000000001",
          marketStateId: 1,
          marketType: "categorical",
          maxPrice: 1,
          minPrice: 0,
          numOutcomes: 8,
          numTicks: 10000,
          reportingFeeRate: 0.02,
          reportingRoundsCompleted: 1,
          reportingState: "DESIGNATED_REPORTING",
          resolutionSource: "http://www.trusted-third-party.com",
          sharesOutstanding: 0,
          shortDescription: "This is a categorical test market created by b0b.",
          tag1: "test tag 1",
          tag2: "test tag 2",
          universe: "0x000000000000000000000000000000000000000b",
          volume: 0,
        });
      },
      onCompletedRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records.crowdsourcer, {
          crowdsourcerId: "0x0000000000000000002000000000000000000001",
          marketId: "0x0000000000000000000000000000000000000001",
          feeWindow: "0x2000000000000000000000000000000000000000",
          completed: null,
          tentativeWinning: 0,
          winning: null,
        });

        assert.deepEqual(records.market, {
          category: "test category",
          consensusPayoutId: null,
          creationBlockNumber: 1400000,
          creationFee: 10,
          creationTime: 1506473474,
          designatedReportStake: 10,
          designatedReporter: "0x0000000000000000000000000000000000000b0b",
          endTime: 1506573470,
          feeWindow: "0x1000000000000000000000000000000000000000",
          finalizationTime: null,
          initialReportSize: null,
          isInvalid: null,
          longDescription: null,
          marketCreator: "0x0000000000000000000000000000000000000b0b",
          marketCreatorFeeRate: 0.01,
          marketCreatorFeesClaimed: 0,
          marketCreatorFeesCollected: 0,
          marketId: "0x0000000000000000000000000000000000000001",
          marketStateId: 1,
          marketType: "categorical",
          maxPrice: 1,
          minPrice: 0,
          numOutcomes: 8,
          numTicks: 10000,
          reportingFeeRate: 0.02,
          reportingRoundsCompleted: 0,
          reportingState: "DESIGNATED_REPORTING",
          resolutionSource: "http://www.trusted-third-party.com",
          sharesOutstanding: 0,
          shortDescription: "This is a categorical test market created by b0b.",
          tag1: "test tag 1",
          tag2: "test tag 2",
          universe: "0x000000000000000000000000000000000000000b",
          volume: 0,
        });
      },
    },
  });
});
