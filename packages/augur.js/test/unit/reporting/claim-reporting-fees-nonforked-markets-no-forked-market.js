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

describe("reporting/claim-reporting-fees-nonforked-markets", function () {
  var claimReportingFeesNonforkedMarkets;
  var disputeCrowdsourcerRedeemStub;
  var feeWindowRedeemStub;
  var initialReporterRedeemStub;
  var marketDisavowCrowdsourcersStub;
  var DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE = "0x5418";
  var FEE_WINDOW_REDEEM_GAS_ESTIMATE = "0x5418";
  var INITIAL_REPORTER_REDEEM_GAS_ESTIMATE = "0x5418";
  var MARKET_DISAVOW_CROWDSOURCERS_GAS_ESTIMATE = "0x5318";
  var NONFORKED_MARKET_UNIVERSE_ADDRESS = "0x0fAdd00000000000000000000000000000000000";
  var REDEEMER_ADDRESS = "0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb";
  var params = {
    redeemer: REDEEMER_ADDRESS,
    feeWindows: [
      "0xfeeAdd0000000000000000000000000000000001",
    ],
    forkedMarket: null,
    nonforkedMarkets: [
      {
        marketId: "0x0fAdd00000000000000000000000000000000001",
        universe: NONFORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: false,
        isMigrated: false,
        isFinalized: false,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000001",
          "0x0fcAdd0000000000000000000000000000000002",
        ],
        initialReporter: "0x0f1Add0000000000000000000000000000000001",
      },
      {
        marketId: "0x0fAdd00000000000000000000000000000000002",
        universe: NONFORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: true,
        isMigrated: false,
        isFinalized: false,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000003",
          "0x0fcAdd0000000000000000000000000000000004",
        ],
        initialReporter: "0x0f1Add0000000000000000000000000000000002",
      },
      {
        marketId: "0x0fAdd00000000000000000000000000000000003",
        universe: NONFORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: false,
        isMigrated: true,
        isFinalized: false,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000005",
          "0x0fcAdd0000000000000000000000000000000006",
        ],
        initialReporter: "0x0f1Add0000000000000000000000000000000003",
      },
      {
        marketId: "0x0fAdd00000000000000000000000000000000004",
        universe: NONFORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: false,
        isMigrated: false,
        isFinalized: true,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000007",
          "0x0fcAdd0000000000000000000000000000000008",
        ],
        initialReporter: "0x0f1Add0000000000000000000000000000000004",
      },
      {
        marketId: "0x0fAdd00000000000000000000000000000000005",
        universe: NONFORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: true,
        isMigrated: true,
        isFinalized: false,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000009",
          "0x0fcAdd0000000000000000000000000000000010",
        ],
        initialReporter: "0x0f1Add0000000000000000000000000000000005",
      },
      {
        marketId: "0x0fAdd00000000000000000000000000000000006",
        universe: NONFORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: true,
        isMigrated: false,
        isFinalized: true,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000011",
          "0x0fcAdd0000000000000000000000000000000012",
        ],
        initialReporter: "0x0f1Add0000000000000000000000000000000006",
      },
      {
        marketId: "0x0fAdd00000000000000000000000000000000007",
        universe: NONFORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: false,
        isMigrated: true,
        isFinalized: true,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000013",
          "0x0fcAdd0000000000000000000000000000000014",
        ],
        initialReporter: "0x0f1Add0000000000000000000000000000000007",
      },
      {
        marketId: "0x0fAdd00000000000000000000000000000000008",
        universe: NONFORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: true,
        isMigrated: true,
        isFinalized: true,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000015",
          "0x0fcAdd0000000000000000000000000000000016",
        ],
        initialReporter: "0x0f1Add0000000000000000000000000000000008",
      },
    ],
    estimateGas: true,
  };
  var claimReportingFeesNonforkedMarketsResult;
  var api = function () {
    return {
      DisputeCrowdsourcer: {
        redeem: disputeCrowdsourcerRedeemStub,
      },
      FeeWindow: {
        redeem: feeWindowRedeemStub,
      },
      InitialReporter: {
        redeem: initialReporterRedeemStub,
      },
      Market: {
        disavowCrowdsourcers: marketDisavowCrowdsourcersStub,
      },
    };
  };

  describe("When a user wants to claim fees on non-forked markets and a forked market does not exist in the same universe", function () {
    describe("and estimateGas is true", function () {
      before(function () {
        disputeCrowdsourcerRedeemStub = sinon.stub(api().DisputeCrowdsourcer, "redeem").callsFake(function (p) { p.onSuccess(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE); });
        feeWindowRedeemStub = sinon.stub(api().FeeWindow, "redeem").callsFake(function (p) { p.onSuccess(FEE_WINDOW_REDEEM_GAS_ESTIMATE); });
        initialReporterRedeemStub = sinon.stub(api().InitialReporter, "redeem").callsFake(function (p) { p.onSuccess(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE); });
        marketDisavowCrowdsourcersStub = sinon.stub(api().Market, "disavowCrowdsourcers").callsFake(function (p) { p.onSuccess(MARKET_DISAVOW_CROWDSOURCERS_GAS_ESTIMATE); });
        claimReportingFeesNonforkedMarkets = proxyquire("../../../src/reporting/claim-reporting-fees-nonforked-markets", {
          "../api": api,
        });
        claimReportingFeesNonforkedMarkets(assign(params, {
          onSent: noop,
          onSuccess: function (res) {
            claimReportingFeesNonforkedMarketsResult = res;
          },
          onFailed: noop,
        }));
      });

      after(function () {
        disputeCrowdsourcerRedeemStub = null;
        feeWindowRedeemStub = null;
        initialReporterRedeemStub = null;
        marketDisavowCrowdsourcersStub = null;
      });

      describe("DisputeCrowdsourcer.redeem", function () {
        it("should be called once for every dispute crowdsourcer belonging to a non-forked market or belonging to the forked market and having had its DisputeCrowdsourcer.fork function called", function () {
          sinon.assert.callCount(disputeCrowdsourcerRedeemStub, 16);
        });
        it("should receive the expected input parameters for each call to DisputeCrowdsourcer.redeem", function () {
          var expectedDisputeCrowdsourcerRedeemAddresses = [
            "0x0fcAdd0000000000000000000000000000000001",
            "0x0fcAdd0000000000000000000000000000000002",
            "0x0fcAdd0000000000000000000000000000000003",
            "0x0fcAdd0000000000000000000000000000000004",
            "0x0fcAdd0000000000000000000000000000000005",
            "0x0fcAdd0000000000000000000000000000000006",
            "0x0fcAdd0000000000000000000000000000000007",
            "0x0fcAdd0000000000000000000000000000000008",
            "0x0fcAdd0000000000000000000000000000000009",
            "0x0fcAdd0000000000000000000000000000000010",
            "0x0fcAdd0000000000000000000000000000000011",
            "0x0fcAdd0000000000000000000000000000000012",
            "0x0fcAdd0000000000000000000000000000000013",
            "0x0fcAdd0000000000000000000000000000000014",
            "0x0fcAdd0000000000000000000000000000000015",
            "0x0fcAdd0000000000000000000000000000000016",
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

      describe("FeeWindow.redeem", function () {
        it("should be called 1 time", function () {
          sinon.assert.callCount(feeWindowRedeemStub, 1);
        });
        it("should receive the expected input parameters for each call to FeeWindow.redeem", function () {
          var expectedInput = {
            _sender: REDEEMER_ADDRESS,
            tx: {
              to: "0xfeeAdd0000000000000000000000000000000001",
              estimateGas: true,
            },
          };
          var actualInput = feeWindowRedeemStub.args[0][0];
          assert.deepEqual(expectedInput._sender, actualInput._sender);
          assert.deepEqual(expectedInput.tx, actualInput.tx);
        });
      });

      describe("InitialReporter.redeem", function () {
        it("should be called once for every initial reporter belonging to a non-forked market or belonging to the forked market and having had its InitialReporter.fork function called", function () {
          sinon.assert.callCount(initialReporterRedeemStub, 8);
        });
        it("should receive the expected input parameters for each call to InitialReport.redeem", function () {
          var expectedInitialReportRedeemAddresses = [
            "0x0f1Add0000000000000000000000000000000001",
            "0x0f1Add0000000000000000000000000000000002",
            "0x0f1Add0000000000000000000000000000000003",
            "0x0f1Add0000000000000000000000000000000004",
            "0x0f1Add0000000000000000000000000000000005",
            "0x0f1Add0000000000000000000000000000000006",
            "0x0f1Add0000000000000000000000000000000007",
            "0x0f1Add0000000000000000000000000000000008",
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

      describe("Market.disavowCrowdsourcers", function () {
        it("should not be called", function () {
          sinon.assert.notCalled(marketDisavowCrowdsourcersStub);
        });
      });

      describe("returned object", function () {
        it("should contain the expected gas estimates", function () {
          var disavowCrowdsourcersTotal = new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16).multipliedBy(marketDisavowCrowdsourcersStub.callCount);
          var feeWindowRedeemTotal = new BigNumber(FEE_WINDOW_REDEEM_GAS_ESTIMATE, 16).multipliedBy(feeWindowRedeemStub.callCount);
          var crowdsourcerRedeemTotal = new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16).multipliedBy(disputeCrowdsourcerRedeemStub.callCount);
          var initialReporterRedeemTotal = new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16).multipliedBy(initialReporterRedeemStub.callCount);
          var expectedResult = {
            gasEstimates: {
              disavowCrowdsourcers: [],
              feeWindowRedeem: [
                { address: "0xfeeAdd0000000000000000000000000000000001", estimate: new BigNumber(FEE_WINDOW_REDEEM_GAS_ESTIMATE, 16) },
              ],
              crowdsourcerRedeem: [
                { address: "0x0fcAdd0000000000000000000000000000000001", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0fcAdd0000000000000000000000000000000002", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0fcAdd0000000000000000000000000000000003", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0fcAdd0000000000000000000000000000000004", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0fcAdd0000000000000000000000000000000005", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0fcAdd0000000000000000000000000000000006", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0fcAdd0000000000000000000000000000000007", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0fcAdd0000000000000000000000000000000008", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0fcAdd0000000000000000000000000000000009", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0fcAdd0000000000000000000000000000000010", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0fcAdd0000000000000000000000000000000011", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0fcAdd0000000000000000000000000000000012", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0fcAdd0000000000000000000000000000000013", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0fcAdd0000000000000000000000000000000014", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0fcAdd0000000000000000000000000000000015", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0fcAdd0000000000000000000000000000000016", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
              ],
              initialReporterRedeem: [
                { address: "0x0f1Add0000000000000000000000000000000001", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0f1Add0000000000000000000000000000000002", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0f1Add0000000000000000000000000000000003", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0f1Add0000000000000000000000000000000004", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0f1Add0000000000000000000000000000000005", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0f1Add0000000000000000000000000000000006", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0f1Add0000000000000000000000000000000007", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                { address: "0x0f1Add0000000000000000000000000000000008", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
              ],
              totals: {
                disavowCrowdsourcers: disavowCrowdsourcersTotal.toString(),
                feeWindowRedeem: feeWindowRedeemTotal.toString(),
                crowdsourcerRedeem: crowdsourcerRedeemTotal.toString(),
                initialReporterRedeem: initialReporterRedeemTotal.toString(),
                all: disavowCrowdsourcersTotal
                    .plus(feeWindowRedeemTotal)
                    .plus(crowdsourcerRedeemTotal)
                    .plus(initialReporterRedeemTotal).toString(),
              },
            },
          };
          assert.deepEqual(expectedResult.gasEstimates, claimReportingFeesNonforkedMarketsResult.gasEstimates);
        });
      });
    });

    describe("and estimateGas is false", function () {
      before(function () {
        params.estimateGas = false;
        disputeCrowdsourcerRedeemStub = sinon.stub(api().DisputeCrowdsourcer, "redeem").callsFake(function (p) { p.onSuccess(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE); });
        feeWindowRedeemStub = sinon.stub(api().FeeWindow, "redeem").callsFake(function (p) { p.onSuccess(FEE_WINDOW_REDEEM_GAS_ESTIMATE); });
        initialReporterRedeemStub = sinon.stub(api().InitialReporter, "redeem").callsFake(function (p) { p.onSuccess(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE); });
        marketDisavowCrowdsourcersStub = sinon.stub(api().Market, "disavowCrowdsourcers").callsFake(function (p) { p.onSuccess(MARKET_DISAVOW_CROWDSOURCERS_GAS_ESTIMATE); });
        claimReportingFeesNonforkedMarkets = proxyquire("../../../src/reporting/claim-reporting-fees-nonforked-markets", {
          "../api": api,
        });
        claimReportingFeesNonforkedMarkets(assign(params, {
          onSent: noop,
          onSuccess: function (res) {
            claimReportingFeesNonforkedMarketsResult = res;
          },
          onFailed: noop,
        }));
      });

      describe("DisputeCrowdsourcer.redeem", function () {
        it("should be called once for every dispute crowdsourcer belonging to a non-forked market or belonging to the forked market and having had its DisputeCrowdsourcer.fork function called", function () {
          sinon.assert.callCount(disputeCrowdsourcerRedeemStub, 16);
        });
        it("should receive the expected input parameters for each call to DisputeCrowdsourcer.redeem", function () {
          var expectedDisputeCrowdsourcerRedeemAddresses = [
            "0x0fcAdd0000000000000000000000000000000001",
            "0x0fcAdd0000000000000000000000000000000002",
            "0x0fcAdd0000000000000000000000000000000003",
            "0x0fcAdd0000000000000000000000000000000004",
            "0x0fcAdd0000000000000000000000000000000005",
            "0x0fcAdd0000000000000000000000000000000006",
            "0x0fcAdd0000000000000000000000000000000007",
            "0x0fcAdd0000000000000000000000000000000008",
            "0x0fcAdd0000000000000000000000000000000009",
            "0x0fcAdd0000000000000000000000000000000010",
            "0x0fcAdd0000000000000000000000000000000011",
            "0x0fcAdd0000000000000000000000000000000012",
            "0x0fcAdd0000000000000000000000000000000013",
            "0x0fcAdd0000000000000000000000000000000014",
            "0x0fcAdd0000000000000000000000000000000015",
            "0x0fcAdd0000000000000000000000000000000016",
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

      describe("FeeWindow.redeem", function () {
        it("should be called 1 time", function () {
          sinon.assert.callCount(feeWindowRedeemStub, 1);
        });
        it("should receive the expected input parameters for each call to FeeWindow.redeem", function () {
          var expectedInput = {
            _sender: REDEEMER_ADDRESS,
            tx: {
              to: "0xfeeAdd0000000000000000000000000000000001",
              estimateGas: false,
            },
          };
          var actualInput = feeWindowRedeemStub.args[0][0];
          assert.deepEqual(expectedInput._sender, actualInput._sender);
          assert.deepEqual(expectedInput.tx, actualInput.tx);
        });
      });

      describe("InitialReporter.redeem", function () {
        it("should be called once for every initial reporter belonging to a non-forked market or belonging to the forked market and having had its InitialReporter.fork function called", function () {
          sinon.assert.callCount(initialReporterRedeemStub, 8);
        });
        it("should receive the expected input parameters for each call to InitialReport.redeem", function () {
          var expectedInitialReportRedeemAddresses = [
            "0x0f1Add0000000000000000000000000000000001",
            "0x0f1Add0000000000000000000000000000000002",
            "0x0f1Add0000000000000000000000000000000003",
            "0x0f1Add0000000000000000000000000000000004",
            "0x0f1Add0000000000000000000000000000000005",
            "0x0f1Add0000000000000000000000000000000006",
            "0x0f1Add0000000000000000000000000000000007",
            "0x0f1Add0000000000000000000000000000000008",
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

      describe("Market.disavowCrowdsourcers", function () {
        it("should not be called", function () {
          sinon.assert.notCalled(marketDisavowCrowdsourcersStub);
        });
      });

      describe("returned object", function () {
        it("should contain the expected gas estimates", function () {
          var expectedResult = {
            successfulTransactions: {
              disavowCrowdsourcers: [],
              feeWindowRedeem: ["0xfeeAdd0000000000000000000000000000000001"],
              crowdsourcerRedeem: [
                "0x0fcAdd0000000000000000000000000000000001",
                "0x0fcAdd0000000000000000000000000000000002",
                "0x0fcAdd0000000000000000000000000000000003",
                "0x0fcAdd0000000000000000000000000000000004",
                "0x0fcAdd0000000000000000000000000000000005",
                "0x0fcAdd0000000000000000000000000000000006",
                "0x0fcAdd0000000000000000000000000000000007",
                "0x0fcAdd0000000000000000000000000000000008",
                "0x0fcAdd0000000000000000000000000000000009",
                "0x0fcAdd0000000000000000000000000000000010",
                "0x0fcAdd0000000000000000000000000000000011",
                "0x0fcAdd0000000000000000000000000000000012",
                "0x0fcAdd0000000000000000000000000000000013",
                "0x0fcAdd0000000000000000000000000000000014",
                "0x0fcAdd0000000000000000000000000000000015",
                "0x0fcAdd0000000000000000000000000000000016",
              ],
              initialReporterRedeem: [
                "0x0f1Add0000000000000000000000000000000001",
                "0x0f1Add0000000000000000000000000000000002",
                "0x0f1Add0000000000000000000000000000000003",
                "0x0f1Add0000000000000000000000000000000004",
                "0x0f1Add0000000000000000000000000000000005",
                "0x0f1Add0000000000000000000000000000000006",
                "0x0f1Add0000000000000000000000000000000007",
                "0x0f1Add0000000000000000000000000000000008",
              ],
            },
          };

          assert.deepEqual(expectedResult, claimReportingFeesNonforkedMarketsResult);
        });
      });
    });
  });
});
