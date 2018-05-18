/* eslint-env mocha */

/**
 * @todo Create shared unit test files to reduce amount of redundant code for testing claiming of reporting fees.
 */

"use strict";

var assert = require("chai").assert;
var assign = require("lodash").assign;
var BigNumber = require("bignumber.js");
var proxyquire = require("proxyquire").noPreserveCache();
var noop = require("../../../src/utils/noop");
var sinon = require("sinon");

describe("reporting/claim-reporting-fees-forked-market", function () {
  var claimReportingFees;
  var disputeCrowdsourcerForkAndRedeemStub;
  var disputeCrowdsourcerRedeemStub;
  var initialReporterForkAndRedeemStub;
  var initialReporterRedeemStub;
  var DISPUTE_CROWDSOURCER_FORK_AND_REDEEM_GAS_ESTIMATE = "0x5318";
  var DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE = "0x5418";
  var INITIAL_REPORTER_FORK_AND_REDEEM_GAS_ESTIMATE = "0x5318";
  var INITIAL_REPORTER_REDEEM_GAS_ESTIMATE = "0x5418";
  var FORKED_MARKET_UNIVERSE_ADDRESS = "0xfAdd000000000000000000000000000000000000";
  var REDEEMER_ADDRESS = "0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb";
  var params = {
    redeemer: REDEEMER_ADDRESS,
    forkedMarket: {
      marketId: "0xfAdd000000000000000000000000000000000000",
      universe: FORKED_MARKET_UNIVERSE_ADDRESS,
      isFinalized: true,
      crowdsourcers: [
        {
          crowdsourcerId: "0xfcAdd00000000000000000000000000000000001",
          needsFork: false,
        },
        {
          crowdsourcerId: "0xfcAdd00000000000000000000000000000000002",
          needsFork: true,
        },
      ],
      initialReporter: {
        initialReporterId: "0xf1Add00000000000000000000000000000000000",
        needsFork: false,
      },
    },
    estimateGas: true,
  };
  var claimReportingFeesResult;
  var api = function () {
    return {
      DisputeCrowdsourcer: {
        forkAndRedeem: disputeCrowdsourcerForkAndRedeemStub,
        redeem: disputeCrowdsourcerRedeemStub,
      },
      InitialReporter: {
        forkAndRedeem: initialReporterForkAndRedeemStub,
        redeem: initialReporterRedeemStub,
      },
    };
  };

  describe("When a user wants to claim fees on a forked market with an initial reporter that does not need to be forked", function () {
    describe("and estimateGas is true", function () {
      before(function () {
        disputeCrowdsourcerForkAndRedeemStub = sinon.stub(api().DisputeCrowdsourcer, "forkAndRedeem").callsFake(function (p) { p.onSuccess(DISPUTE_CROWDSOURCER_FORK_AND_REDEEM_GAS_ESTIMATE); });
        disputeCrowdsourcerRedeemStub = sinon.stub(api().DisputeCrowdsourcer, "redeem").callsFake(function (p) { p.onSuccess(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE); });
        initialReporterForkAndRedeemStub = sinon.stub(api().InitialReporter, "forkAndRedeem").callsFake(function (p) { p.onSuccess(INITIAL_REPORTER_FORK_AND_REDEEM_GAS_ESTIMATE); });
        initialReporterRedeemStub = sinon.stub(api().InitialReporter, "redeem").callsFake(function (p) { p.onSuccess(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE); });
        claimReportingFees = proxyquire("../../../src/reporting/claim-reporting-fees-forked-market", {
          "../api": api,
        });
        claimReportingFees(assign(params, {
          onSent: noop,
          onSuccess: function (res) {
            claimReportingFeesResult = res;
          },
          onFailed: noop,
        }));
      });

      after(function () {
        disputeCrowdsourcerForkAndRedeemStub = null;
        disputeCrowdsourcerRedeemStub = null;
        initialReporterForkAndRedeemStub = null;
        initialReporterRedeemStub = null;
      });

      describe("DisputeCrowdsourcer.forkAndRedeem", function () {
        it("should be called once for every dispute crowdsourcer belonging to the forked market that has not had its DisputeCrowdsourcer.fork function called", function () {
          sinon.assert.callCount(disputeCrowdsourcerForkAndRedeemStub, 1);
        });
        it("should receive the expected input parameters for each call to DisputeCrowdsourcer.forkAndRedeem", function () {
          var expectedInput = {
            tx: {
              to: "0xfcAdd00000000000000000000000000000000002",
              estimateGas: true,
            },
          };
          var actualInput = disputeCrowdsourcerForkAndRedeemStub.args[0][0];
          assert.deepEqual(expectedInput.tx, actualInput.tx);
        });
      });

      describe("DisputeCrowdsourcer.redeem", function () {
        it("should be called once for every dispute crowdsourcer belonging to the forked market that has had its DisputeCrowdsourcer.fork function called", function () {
          sinon.assert.callCount(disputeCrowdsourcerRedeemStub, 1);
        });
        it("should receive the expected input parameters for each call to DisputeCrowdsourcer.redeem", function () {
          var expectedDisputeCrowdsourcerRedeemAddresses = [
            "0xfcAdd00000000000000000000000000000000001",
          ];
          for (var i = 0; i < expectedDisputeCrowdsourcerRedeemAddresses[i]; i++) {
            var expectedInput = {
              _redeemer: REDEEMER_ADDRESS,
              tx: {
                to: expectedDisputeCrowdsourcerRedeemAddresses[i],
                estimateGas: true,
              },
            };
            var actualInput = disputeCrowdsourcerRedeemStub.args[i][0];
            assert.deepEqual(expectedInput._redeemer, actualInput._redeemer);
            assert.deepEqual(expectedInput.tx, actualInput.tx);
          }
        });
      });

      describe("InitialReporter.forkAndRedeem", function () {
        it("should be called 0 times", function () {
          sinon.assert.notCalled(initialReporterForkAndRedeemStub);
        });
      });

      describe("InitialReporter.redeem", function () {
        it("should be called 1 time", function () {
          sinon.assert.callCount(initialReporterRedeemStub, 1);
        });
        it("should receive the expected input parameters for each call to InitialReport.redeem", function () {
          var expectedInitialReportRedeemAddresses = [
            "0xf1Add00000000000000000000000000000000000",
          ];
          for (var i = 0; i < expectedInitialReportRedeemAddresses[i]; i++) {
            var expectedInput = {
              "": REDEEMER_ADDRESS,
              tx: {
                to: expectedInitialReportRedeemAddresses[i],
                estimateGas: true,
              },
            };
            var actualInput = initialReporterRedeemStub.args[i][0];
            assert.deepEqual(expectedInput[""], actualInput[""]);
            assert.deepEqual(expectedInput.tx, actualInput.tx);
          }
        });
      });

      describe("returned object", function () {
        it("should contain the expected gas estimates", function () {
          var crowdsourcerForkAndRedeemTotal = new BigNumber(DISPUTE_CROWDSOURCER_FORK_AND_REDEEM_GAS_ESTIMATE, 16).multipliedBy(disputeCrowdsourcerForkAndRedeemStub.callCount);
          var initialReporterForkAndRedeemTotal = new BigNumber(INITIAL_REPORTER_FORK_AND_REDEEM_GAS_ESTIMATE, 16).multipliedBy(initialReporterForkAndRedeemStub.callCount);
          var crowdsourcerRedeemTotal = new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16).multipliedBy(disputeCrowdsourcerRedeemStub.callCount);
          var initialReporterRedeemTotal = new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16).multipliedBy(initialReporterRedeemStub.callCount);
          var expectedResult = {
            gasEstimates: {
              crowdsourcerForkAndRedeem: [
                { address: "0xfcAdd00000000000000000000000000000000002", estimate: new BigNumber(DISPUTE_CROWDSOURCER_FORK_AND_REDEEM_GAS_ESTIMATE, 16) },
              ],
              initialReporterForkAndRedeem: [],
              crowdsourcerRedeem: [
                { address: "0xfcAdd00000000000000000000000000000000001", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
              ],
              initialReporterRedeem: [
                { address: "0xf1Add00000000000000000000000000000000000", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
              ],
              totals: {
                crowdsourcerForkAndRedeem: crowdsourcerForkAndRedeemTotal.toString(),
                initialReporterForkAndRedeem: initialReporterForkAndRedeemTotal.toString(),
                crowdsourcerRedeem: crowdsourcerRedeemTotal.toString(),
                initialReporterRedeem: initialReporterRedeemTotal.toString(),
                all: crowdsourcerForkAndRedeemTotal
                    .plus(initialReporterForkAndRedeemTotal)
                    .plus(crowdsourcerRedeemTotal)
                    .plus(initialReporterRedeemTotal).toString(),
              },
            },
          };
          assert.deepEqual(expectedResult.gasEstimates, claimReportingFeesResult.gasEstimates);
        });
      });
    });

    describe("and estimateGas is false", function () {
      before(function () {
        params.estimateGas = false;
        disputeCrowdsourcerForkAndRedeemStub = sinon.stub(api().DisputeCrowdsourcer, "forkAndRedeem").callsFake(function (p) { p.onSuccess(DISPUTE_CROWDSOURCER_FORK_AND_REDEEM_GAS_ESTIMATE); });
        disputeCrowdsourcerRedeemStub = sinon.stub(api().DisputeCrowdsourcer, "redeem").callsFake(function (p) { p.onSuccess(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE); });
        initialReporterForkAndRedeemStub = sinon.stub(api().InitialReporter, "forkAndRedeem").callsFake(function (p) { p.onSuccess(INITIAL_REPORTER_FORK_AND_REDEEM_GAS_ESTIMATE); });
        initialReporterRedeemStub = sinon.stub(api().InitialReporter, "redeem").callsFake(function (p) { p.onSuccess(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE); });
        claimReportingFees = proxyquire("../../../src/reporting/claim-reporting-fees-forked-market", {
          "../api": api,
        });
        claimReportingFees(assign(params, {
          onSent: noop,
          onSuccess: function (res) {
            claimReportingFeesResult = res;
          },
          onFailed: noop,
        }));
      });

      describe("DisputeCrowdsourcer.forkAndRedeem", function () {
        it("should be called once for every dispute crowdsourcer belonging to the forked market that has not had its DisputeCrowdsourcer.fork function called", function () {
          sinon.assert.callCount(disputeCrowdsourcerForkAndRedeemStub, 1);
        });
        it("should receive the expected input parameters for each call to DisputeCrowdsourcer.forkAndRedeem", function () {
          var expectedInput = {
            tx: {
              to: "0xfcAdd00000000000000000000000000000000002",
              estimateGas: false,
            },
          };
          var actualInput = disputeCrowdsourcerForkAndRedeemStub.args[0][0];
          assert.deepEqual(expectedInput.tx, actualInput.tx);
        });
      });

      describe("DisputeCrowdsourcer.redeem", function () {
        it("should be called once for every dispute crowdsourcer belonging to the forked market that has had its DisputeCrowdsourcer.fork function called", function () {
          sinon.assert.callCount(disputeCrowdsourcerRedeemStub, 1);
        });
        it("should receive the expected input parameters for each call to DisputeCrowdsourcer.redeem", function () {
          var expectedDisputeCrowdsourcerRedeemAddresses = [
            "0xfcAdd00000000000000000000000000000000001",
          ];
          for (var i = 0; i < expectedDisputeCrowdsourcerRedeemAddresses[i]; i++) {
            var expectedInput = {
              _redeemer: REDEEMER_ADDRESS,
              tx: {
                to: expectedDisputeCrowdsourcerRedeemAddresses[i],
                estimateGas: false,
              },
            };
            var actualInput = disputeCrowdsourcerRedeemStub.args[i][0];
            assert.deepEqual(expectedInput._redeemer, actualInput._redeemer);
            assert.deepEqual(expectedInput.tx, actualInput.tx);
          }
        });
      });

      describe("InitialReporter.forkAndRedeem", function () {
        it("should be called 0 times", function () {
          sinon.assert.notCalled(initialReporterForkAndRedeemStub);
        });
      });

      describe("InitialReporter.redeem", function () {
        it("should be called 1 time", function () {
          sinon.assert.callCount(initialReporterRedeemStub, 1);
        });
        it("should receive the expected input parameters for each call to InitialReport.redeem", function () {
          var expectedInitialReportRedeemAddresses = [
            "0xf1Add00000000000000000000000000000000000",
          ];
          for (var i = 0; i < expectedInitialReportRedeemAddresses[i]; i++) {
            var expectedInput = {
              "": REDEEMER_ADDRESS,
              tx: {
                to: expectedInitialReportRedeemAddresses[i],
                estimateGas: false,
              },
            };
            var actualInput = initialReporterRedeemStub.args[i][0];
            assert.deepEqual(expectedInput[""], actualInput[""]);
            assert.deepEqual(expectedInput.tx, actualInput.tx);
          }
        });
      });

      describe("returned object", function () {
        it("should contain the expected gas estimates", function () {
          var expectedResult = {
            successfulTransactions: {
              crowdsourcerForkAndRedeem: ["0xfcAdd00000000000000000000000000000000002"],
              initialReporterForkAndRedeem: [],
              crowdsourcerRedeem: [
                "0xfcAdd00000000000000000000000000000000001",
              ],
              initialReporterRedeem: [
                "0xf1Add00000000000000000000000000000000000",
              ],
            },
          };

          assert.deepEqual(expectedResult, claimReportingFeesResult);
        });
      });
    });
  });
});
