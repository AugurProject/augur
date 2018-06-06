"use strict";

const Augur = require("augur.js");
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {BigNumber} = require("bignumber.js");
const {
  processDisputeCrowdsourcerCreatedLog, processDisputeCrowdsourcerCreatedLogRemoval,
  processDisputeCrowdsourcerContributionLog, processDisputeCrowdsourcerContributionLogRemoval,
  processDisputeCrowdsourcerCompletedLog, processDisputeCrowdsourcerCompletedLogRemoval,
}
  = require("../../../build/blockchain/log-processors/crowdsourcer");
const {getMarketsWithReportingState} = require("../../../build/server/getters/database");
const {setOverrideTimestamp, removeOverrideTimestamp} = require("../../../build/blockchain/process-block.js");


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

const getCrowdsourcerAndMarket = (db, params, callback) => {
  getCrowdsourcer(db, params, (err, crowdsourcer) => {
    if (err) return callback(err);

    getMarketsWithReportingState(db).first().where({"markets.marketId": crowdsourcer.marketId})
      .asCallback((err, market) => {
        if (err) return callback(err);

        callback(null, {market, crowdsourcer});
      });
  });
};


describe("blockchain/log-processors/crowdsourcers", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        setOverrideTimestamp(db, t.params.overrideTimestamp, (err) => {
          assert.ifError(err);
          db.transaction((trx) => {
            function verify(processor, getter, checker, callback) {
              processor(trx, t.params.augur, t.params.log, (err) => {
                assert.ifError(err);
                getter(trx, t.params, (err, records) => {
                  assert.ifError(err);
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
                        removeOverrideTimestamp(db, t.params.overrideTimestamp, (err) => {
                          assert.isNotNull(err);
                          db.destroy();
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
        market: "0x0000000000000000000000000000000000000211",
        disputeCrowdsourcer: "0x0000000000000000002000000000000000000001",
        reporter: "0x0000000000000000000000000000000000000b0b",
        size: 20000,
        amountStaked: new BigNumber("19381", 10),
        payoutNumerators: [0, 1],
        invalid: false,
        blockNumber: 1400100,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
        logIndex: 0,
      },
      augur: {
        constants: new Augur().constants,
        api: {
          Universe: {
            getFeeWindowByTimestamp: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x000000000000000000000000000000000000000b");
              const feeWindowByTimestamp = {
                1509085473: "0x2000000000000000000000000000000000000000",
                1509690273: "0x2100000000000000000000000000000000000000",
              };
              const feeWindow = feeWindowByTimestamp[p._timestamp];
              assert.isString(feeWindow);
              callback(null, feeWindow);
            },
          },
        },
      },
      overrideTimestamp: 1509085473,
    },
    assertions: {
      onCreated: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, {
          crowdsourcerId: "0x0000000000000000002000000000000000000001",
          marketId: "0x0000000000000000000000000000000000000211",
          feeWindow: "0x2000000000000000000000000000000000000000",
          completed: null,
          tentativeWinning: 0,
          winning: null,
        });
      },
      onCreatedRemoved: (err, records) => {
        assert.ifError(err);
        assert.isUndefined(records);
      },
      onContributed: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, [{
          blockNumber: 1400100,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
          logIndex: 0,
          disputeId: 8,
          crowdsourcerId: "0x0000000000000000002000000000000000000001",
          reporter: "0x0000000000000000000000000000000000000b0b",
          amountStaked: new BigNumber("19381", 10),
        }]);
      },
      onContributedRemoved: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, []);
      },
      onCompleted: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records.crowdsourcer, {
          crowdsourcerId: "0x0000000000000000002000000000000000000001",
          marketId: "0x0000000000000000000000000000000000000211",
          feeWindow: "0x2000000000000000000000000000000000000000",
          completed: 1,
          tentativeWinning: 1,
          winning: null,
        });

        assert.deepEqual(records.market, {
          category: "test category",
          consensusPayoutId: null,
          creationBlockNumber: 1500001,
          creationFee: new BigNumber("10", 10),
          creationTime: 1509065474,
          designatedReportStake: new BigNumber("10", 10),
          designatedReporter: "0x0000000000000000000000000000000000000b0b",
          endTime: 1507573470,
          feeWindow: "0x2100000000000000000000000000000000000000",
          finalizationBlockNumber: null,
          forking: 0,
          needsMigration: 0,
          needsDisavowal: 0,
          initialReportSize: new BigNumber("10", 10),
          isInvalid: null,
          longDescription: null,
          marketCreator: "0x0000000000000000000000000000000000000b0b",
          marketCreatorFeeRate: new BigNumber("0.01", 10),
          marketCreatorFeesBalance: new BigNumber("0", 10),
          marketCreatorMailbox: "0xbbb0000000000000000000000000000000000211",
          marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
          marketId: "0x0000000000000000000000000000000000000211",
          marketStateId: 18,
          marketType: "yesNo",
          maxPrice: new BigNumber("1", 10),
          minPrice: new BigNumber("0", 10),
          numOutcomes: 2,
          numTicks: new BigNumber("10000", 10),
          reportingFeeRate: new BigNumber("0.02", 10),
          disputeRounds: 1,
          reportingState: "AWAITING_NEXT_WINDOW",
          resolutionSource: "http://www.trusted-third-party.com",
          scalarDenomination: null,
          sharesOutstanding: new BigNumber("0", 10),
          shortDescription: "This is a yesNo test market created by b0b awaiting round 1 reporting.",
          tag1: "test tag 1",
          tag2: "test tag 2",
          universe: "0x000000000000000000000000000000000000000b",
          volume: new BigNumber("0", 10),
        });
      },
      onCompletedRemoved: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records.crowdsourcer, {
          crowdsourcerId: "0x0000000000000000002000000000000000000001",
          marketId: "0x0000000000000000000000000000000000000211",
          feeWindow: "0x2000000000000000000000000000000000000000",
          completed: null,
          tentativeWinning: 0,
          winning: null,
        });

        assert.deepEqual(records.market, {
          marketId: "0x0000000000000000000000000000000000000211",
          universe: "0x000000000000000000000000000000000000000b",
          marketType: "yesNo",
          numOutcomes: 2,
          minPrice: new BigNumber("0"),
          maxPrice: new BigNumber("1"),
          marketCreator: "0x0000000000000000000000000000000000000b0b",
          creationBlockNumber: 1500001,
          creationFee: new BigNumber("10"),
          reportingFeeRate: new BigNumber("0.02"),
          marketCreatorFeeRate: new BigNumber("0.01"),
          marketCreatorFeesBalance: new BigNumber("0"),
          marketCreatorMailbox: "0xbbb0000000000000000000000000000000000211",
          marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
          initialReportSize: new BigNumber("10"),
          category: "test category",
          tag1: "test tag 1",
          tag2: "test tag 2",
          volume: new BigNumber("0"),
          sharesOutstanding: new BigNumber("0"),
          feeWindow: "0x2000000000000000000000000000000000000000",
          endTime: 1507573470,
          finalizationBlockNumber: null,
          marketStateId: 15,
          shortDescription: "This is a yesNo test market created by b0b awaiting round 1 reporting.",
          longDescription: null,
          scalarDenomination: null,
          designatedReporter: "0x0000000000000000000000000000000000000b0b",
          designatedReportStake: new BigNumber("10"),
          resolutionSource: "http://www.trusted-third-party.com",
          numTicks: new BigNumber("10000"),
          consensusPayoutId: null,
          disputeRounds: 0,
          isInvalid: null,
          reportingState: "CROWDSOURCING_DISPUTE",
          creationTime: 1509065474,
          forking: 0,
          needsMigration: 0,
          needsDisavowal: 0,
        });
      },
    },
  });
});
