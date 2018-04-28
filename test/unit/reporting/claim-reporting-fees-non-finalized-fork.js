/* eslint-env mocha */

/**
 * @todo Create shared unit test files to reduce amount of redundant code for testing claimReportingFees.
 */

"use strict";

var assert = require("chai").assert;
var assign = require("lodash.assign");
var BigNumber = require("bignumber.js");
var proxyquire = require("proxyquire").noPreserveCache();
var noop = require("../../../src/utils/noop");
var sinon = require("sinon");

describe("reporting/claim-reporting-fees", function () {
  var claimReportingFees;
  var disputeCrowdsourcerForkAndRedeemStub;
  var disputeCrowdsourcerRedeemStub;
  var feeWindowRedeemStub;
  var initialReporterForkAndRedeemStub;
  var initialReporterRedeemStub;
  var marketDisavowCrowdsourcersStub;
  var marketMigrateThroughOneForkStub;
  var DISPUTE_CROWDSOURCER_FORK_AND_REDEEM_GAS_ESTIMATE = "0x5318";
  var DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE = "0x5418";
  var FEE_WINDOW_REDEEM_GAS_ESTIMATE = "0x5418";
  var INITIAL_REPORTER_FORK_AND_REDEEM_GAS_ESTIMATE = "0x5318";
  var INITIAL_REPORTER_REDEEM_GAS_ESTIMATE = "0x5418";
  var MARKET_DISAVOW_CROWDSOURCERS_GAS_ESTIMATE = "0x5318";
  var MARKET_MIGRATE_THROUGH_ONE_FORK_GAS_ESTIMATE = "0x5318";
  var FORKED_MARKET_UNIVERSE_ADDRESS = "0xfAdd000000000000000000000000000000000000";
  var NONFORKED_MARKET_UNIVERSE_ADDRESS = "0x0fAdd00000000000000000000000000000000000";
  var REDEEMER_ADDRESS = "0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb";
  var params = {
    redeemer: REDEEMER_ADDRESS,
    feeWindows: [
      "0xfeeAdd0000000000000000000000000000000001",
    ],
    forkedMarket: {
      address: "0xfAdd000000000000000000000000000000000000",
      universeAddress: FORKED_MARKET_UNIVERSE_ADDRESS,
      isFinalized: false,
      crowdsourcers: [
        {
          address: "0xfcAdd00000000000000000000000000000000001",
          isForked: true,
        },
        {
          address: "0xfcAdd00000000000000000000000000000000002",
          isForked: false,
        },
      ],
      initialReporter: {
        address: "0xf1Add00000000000000000000000000000000000",
        isForked: true,
      },
    },
    nonforkedMarkets: [
      {
        address: "0x0fAdd00000000000000000000000000000000001",
        universeAddress: FORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: false,
        isMigrated: false,
        isFinalized: false,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000001",
          "0x0fcAdd0000000000000000000000000000000002",
        ],
        initialReporterAddress: "0x0f1Add0000000000000000000000000000000001",
      },
      {
        address: "0x0fAdd00000000000000000000000000000000002",
        universeAddress: FORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: true,
        isMigrated: false,
        isFinalized: false,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000003",
          "0x0fcAdd0000000000000000000000000000000004",
        ],
        initialReporterAddress: "0x0f1Add0000000000000000000000000000000002",
      },
      {
        address: "0x0fAdd00000000000000000000000000000000003",
        universeAddress: FORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: false,
        isMigrated: true,
        isFinalized: false,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000005",
          "0x0fcAdd0000000000000000000000000000000006",
        ],
        initialReporterAddress: "0x0f1Add0000000000000000000000000000000003",
      },
      {
        address: "0x0fAdd00000000000000000000000000000000004",
        universeAddress: FORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: false,
        isMigrated: false,
        isFinalized: true,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000007",
          "0x0fcAdd0000000000000000000000000000000008",
        ],
        initialReporterAddress: "0x0f1Add0000000000000000000000000000000004",
      },
      {
        address: "0x0fAdd00000000000000000000000000000000005",
        universeAddress: FORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: true,
        isMigrated: true,
        isFinalized: false,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000009",
          "0x0fcAdd0000000000000000000000000000000010",
        ],
        initialReporterAddress: "0x0f1Add0000000000000000000000000000000005",
      },
      {
        address: "0x0fAdd00000000000000000000000000000000006",
        universeAddress: FORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: true,
        isMigrated: false,
        isFinalized: true,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000011",
          "0x0fcAdd0000000000000000000000000000000012",
        ],
        initialReporterAddress: "0x0f1Add0000000000000000000000000000000006",
      },
      {
        address: "0x0fAdd00000000000000000000000000000000007",
        universeAddress: FORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: false,
        isMigrated: true,
        isFinalized: true,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000013",
          "0x0fcAdd0000000000000000000000000000000014",
        ],
        initialReporterAddress: "0x0f1Add0000000000000000000000000000000007",
      },
      {
        address: "0x0fAdd00000000000000000000000000000000008",
        universeAddress: FORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: true,
        isMigrated: true,
        isFinalized: true,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000015",
          "0x0fcAdd0000000000000000000000000000000016",
        ],
        initialReporterAddress: "0x0f1Add0000000000000000000000000000000008",
      },
      {
        address: "0x0fAdd00000000000000000000000000000000009",
        universeAddress: NONFORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: false,
        isMigrated: false,
        isFinalized: false,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000017",
          "0x0fcAdd0000000000000000000000000000000018",
        ],
        initialReporterAddress: "0x0f1Add0000000000000000000000000000000009",
      },
      {
        address: "0x0fAdd00000000000000000000000000000000010",
        universeAddress: NONFORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: true,
        isMigrated: false,
        isFinalized: false,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000019",
          "0x0fcAdd0000000000000000000000000000000020",
        ],
        initialReporterAddress: "0x0f1Add0000000000000000000000000000000010",
      },
      {
        address: "0x0fAdd00000000000000000000000000000000011",
        universeAddress: NONFORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: false,
        isMigrated: true,
        isFinalized: false,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000021",
          "0x0fcAdd0000000000000000000000000000000022",
        ],
        initialReporterAddress: "0x0f1Add0000000000000000000000000000000011",
      },
      {
        address: "0x0fAdd00000000000000000000000000000000012",
        universeAddress: NONFORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: false,
        isMigrated: false,
        isFinalized: true,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000023",
          "0x0fcAdd0000000000000000000000000000000024",
        ],
        initialReporterAddress: "0x0f1Add0000000000000000000000000000000012",
      },
      {
        address: "0x0fAdd00000000000000000000000000000000013",
        universeAddress: NONFORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: true,
        isMigrated: true,
        isFinalized: false,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000025",
          "0x0fcAdd0000000000000000000000000000000026",
        ],
        initialReporterAddress: "0x0f1Add0000000000000000000000000000000013",
      },
      {
        address: "0x0fAdd00000000000000000000000000000000014",
        universeAddress: NONFORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: false,
        isMigrated: true,
        isFinalized: true,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000027",
          "0x0fcAdd0000000000000000000000000000000028",
        ],
        initialReporterAddress: "0x0f1Add0000000000000000000000000000000014",
      },
      {
        address: "0x0fAdd00000000000000000000000000000000015",
        universeAddress: NONFORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: true,
        isMigrated: false,
        isFinalized: true,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000029",
          "0x0fcAdd0000000000000000000000000000000030",
        ],
        initialReporterAddress: "0x0f1Add0000000000000000000000000000000015",
      },
      {
        address: "0x0fAdd00000000000000000000000000000000016",
        universeAddress: NONFORKED_MARKET_UNIVERSE_ADDRESS,
        crowdsourcersAreDisavowed: true,
        isMigrated: true,
        isFinalized: true,
        crowdsourcers: [
          "0x0fcAdd0000000000000000000000000000000031",
          "0x0fcAdd0000000000000000000000000000000032",
        ],
        initialReporterAddress: "0x0f1Add0000000000000000000000000000000016",
      },
    ],
    estimateGas: true,
  };
  var claimReportingFeesResult;
  var api = function () {
    return {
      DisputeCrowdsourcer: {
        forkAndRedeem: disputeCrowdsourcerForkAndRedeemStub,
        redeem: disputeCrowdsourcerRedeemStub,
      },
      FeeWindow: {
        redeem: feeWindowRedeemStub,
      },
      InitialReporter: {
        forkAndRedeem: initialReporterForkAndRedeemStub,
        redeem: initialReporterRedeemStub,
      },
      Market: {
        disavowCrowdsourcers: marketDisavowCrowdsourcersStub,
        migrateThroughOneFork: marketMigrateThroughOneForkStub,
      },
    };
  };

  describe("When a forked market exists in the parent universe", function () {
    describe("and the forked market is not finalized", function () {
      describe("and estimateGas is true", function () {
        before(function () {
          disputeCrowdsourcerForkAndRedeemStub = sinon.stub(api().DisputeCrowdsourcer, "forkAndRedeem").callsFake(function (p) { p.onSuccess(DISPUTE_CROWDSOURCER_FORK_AND_REDEEM_GAS_ESTIMATE); });
          disputeCrowdsourcerRedeemStub = sinon.stub(api().DisputeCrowdsourcer, "redeem").callsFake(function (p) { p.onSuccess(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE); });
          feeWindowRedeemStub = sinon.stub(api().FeeWindow, "redeem").callsFake(function (p) { p.onSuccess(FEE_WINDOW_REDEEM_GAS_ESTIMATE); });
          initialReporterForkAndRedeemStub = sinon.stub(api().InitialReporter, "forkAndRedeem").callsFake(function (p) { p.onSuccess(INITIAL_REPORTER_FORK_AND_REDEEM_GAS_ESTIMATE); });
          initialReporterRedeemStub = sinon.stub(api().InitialReporter, "redeem").callsFake(function (p) { p.onSuccess(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE); });
          marketDisavowCrowdsourcersStub = sinon.stub(api().Market, "disavowCrowdsourcers").callsFake(function (p) { p.onSuccess(MARKET_DISAVOW_CROWDSOURCERS_GAS_ESTIMATE); });
          marketMigrateThroughOneForkStub = sinon.stub(api().Market, "migrateThroughOneFork").callsFake(function (p) { p.onSuccess(MARKET_MIGRATE_THROUGH_ONE_FORK_GAS_ESTIMATE); });
          claimReportingFees = proxyquire("../../../src/reporting/claim-reporting-fees", {
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
          feeWindowRedeemStub = null;
          initialReporterForkAndRedeemStub = null;
          initialReporterRedeemStub = null;
          marketDisavowCrowdsourcersStub = null;
          marketMigrateThroughOneForkStub = null;
        });

        describe("DisputeCrowdsourcer.forkAndRedeem", function () {
          it("should be called 1 time", function () {
            sinon.assert.callCount(disputeCrowdsourcerForkAndRedeemStub, 1);
          });
          it("should receive the expected input parameters for each call to FeeWindow.redeem", function () {
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
          it("should be called once for every dispute crowdsourcer belonging to a non-forked market or belonging to the forked market and having had its DisputeCrowdsourcer.fork function caled", function () {
            sinon.assert.callCount(disputeCrowdsourcerRedeemStub, 33);
          });
          it("should receive the expected input parameters for each call to DisputeCrowdsourcer.redeem", function () {
            var expectedDisputeCrowdsourcerRedeemAddresses = [
              "0xfcAdd00000000000000000000000000000000001",
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
              "0x0fcAdd0000000000000000000000000000000017",
              "0x0fcAdd0000000000000000000000000000000018",
              "0x0fcAdd0000000000000000000000000000000019",
              "0x0fcAdd0000000000000000000000000000000020",
              "0x0fcAdd0000000000000000000000000000000021",
              "0x0fcAdd0000000000000000000000000000000022",
              "0x0fcAdd0000000000000000000000000000000023",
              "0x0fcAdd0000000000000000000000000000000024",
              "0x0fcAdd0000000000000000000000000000000025",
              "0x0fcAdd0000000000000000000000000000000026",
              "0x0fcAdd0000000000000000000000000000000027",
              "0x0fcAdd0000000000000000000000000000000028",
              "0x0fcAdd0000000000000000000000000000000029",
              "0x0fcAdd0000000000000000000000000000000030",
              "0x0fcAdd0000000000000000000000000000000031",
              "0x0fcAdd0000000000000000000000000000000032",
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

        describe("InitialReporter.forkAndRedeem", function () {
          it("should be called 0 times", function () {
            sinon.assert.notCalled(initialReporterForkAndRedeemStub);
          });
        });

        describe("InitialReporter.redeem", function () {
          it("should be called once for every initial reporter belonging to a non-forked market or belonging to the forked market and having had its InitialReporter.fork function caled", function () {
            sinon.assert.callCount(initialReporterRedeemStub, 17);
          });
          it("should receive the expected input parameters for each call to InitialReport.redeem", function () {
            var expectedInitialReportRedeemAddresses = [
              "0xf1Add00000000000000000000000000000000000",
              "0x0f1Add0000000000000000000000000000000001",
              "0x0f1Add0000000000000000000000000000000002",
              "0x0f1Add0000000000000000000000000000000003",
              "0x0f1Add0000000000000000000000000000000004",
              "0x0f1Add0000000000000000000000000000000005",
              "0x0f1Add0000000000000000000000000000000006",
              "0x0f1Add0000000000000000000000000000000007",
              "0x0f1Add0000000000000000000000000000000008",
              "0x0f1Add0000000000000000000000000000000009",
              "0x0f1Add0000000000000000000000000000000010",
              "0x0f1Add0000000000000000000000000000000011",
              "0x0f1Add0000000000000000000000000000000012",
              "0x0f1Add0000000000000000000000000000000013",
              "0x0f1Add0000000000000000000000000000000014",
              "0x0f1Add0000000000000000000000000000000015",
              "0x0f1Add0000000000000000000000000000000016",
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
          it("should be called once for every non-forked, non-finalized, non-migrated market in the same universe as the forked market", function () {
            sinon.assert.callCount(marketDisavowCrowdsourcersStub, 2);

          });
          it("should receive the expected input parameters for each call to Market.migrateThroughOneFork", function () {
            for (var i = 0; i < marketDisavowCrowdsourcersStub.callCount; i++) {
              var expectedMarketMigrateThroughOneForkAddresses = [
                "0x0fAdd00000000000000000000000000000000001",
                "0x0fAdd00000000000000000000000000000000003",
              ];
              var expectedInput = {
                tx: {
                  to: expectedMarketMigrateThroughOneForkAddresses[i],
                  estimateGas: true,
                },
              };
              var actualInput = marketDisavowCrowdsourcersStub.args[i][0];
              assert.deepEqual(expectedInput.tx, actualInput.tx);
            }
          });
        });

        describe("Market.migrateThroughOneFork", function () {
          it("should not be called", function () {
            sinon.assert.notCalled(marketMigrateThroughOneForkStub);
          });
        });

        describe("returned object", function () {
          it("should contain the expected gas estimates", function () {
            var disavowCrowdsourcersTotal = new BigNumber(MARKET_DISAVOW_CROWDSOURCERS_GAS_ESTIMATE, 16).multipliedBy(marketDisavowCrowdsourcersStub.callCount);
            var migrateThroughOneForkTotal = new BigNumber(MARKET_MIGRATE_THROUGH_ONE_FORK_GAS_ESTIMATE, 16).multipliedBy(marketMigrateThroughOneForkStub.callCount);
            var crowdsourcerForkAndRedeemTotal = new BigNumber(DISPUTE_CROWDSOURCER_FORK_AND_REDEEM_GAS_ESTIMATE, 16).multipliedBy(disputeCrowdsourcerForkAndRedeemStub.callCount);
            var initialReporterForkAndRedeemTotal = new BigNumber(INITIAL_REPORTER_FORK_AND_REDEEM_GAS_ESTIMATE, 16).multipliedBy(initialReporterForkAndRedeemStub.callCount);
            var feeWindowRedeemTotal = new BigNumber(FEE_WINDOW_REDEEM_GAS_ESTIMATE, 16).multipliedBy(feeWindowRedeemStub.callCount);
            var crowdsourcerRedeemTotal = new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16).multipliedBy(disputeCrowdsourcerRedeemStub.callCount);
            var initialReporterRedeemTotal = new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16).multipliedBy(initialReporterRedeemStub.callCount);
            var expectedResult = {
              gasEstimates: {
                disavowCrowdsourcers: [
                  { address: "0x0fAdd00000000000000000000000000000000001", estimate: new BigNumber(MARKET_DISAVOW_CROWDSOURCERS_GAS_ESTIMATE, 16) },
                  { address: "0x0fAdd00000000000000000000000000000000003", estimate: new BigNumber(MARKET_DISAVOW_CROWDSOURCERS_GAS_ESTIMATE, 16) },
                ],
                migrateThroughOneFork: [
                ],
                crowdsourcerForkAndRedeem: [
                  { address: "0xfcAdd00000000000000000000000000000000002", estimate: new BigNumber(DISPUTE_CROWDSOURCER_FORK_AND_REDEEM_GAS_ESTIMATE, 16) },
                ],
                initialReporterForkAndRedeem: [],
                feeWindowRedeem: [
                  { address: "0xfeeAdd0000000000000000000000000000000001", estimate: new BigNumber(FEE_WINDOW_REDEEM_GAS_ESTIMATE, 16) },
                ],
                crowdsourcerRedeem: [
                  { address: "0xfcAdd00000000000000000000000000000000001", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
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
                  { address: "0x0fcAdd0000000000000000000000000000000017", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0fcAdd0000000000000000000000000000000018", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0fcAdd0000000000000000000000000000000019", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0fcAdd0000000000000000000000000000000020", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0fcAdd0000000000000000000000000000000021", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0fcAdd0000000000000000000000000000000022", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0fcAdd0000000000000000000000000000000023", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0fcAdd0000000000000000000000000000000024", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0fcAdd0000000000000000000000000000000025", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0fcAdd0000000000000000000000000000000026", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0fcAdd0000000000000000000000000000000027", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0fcAdd0000000000000000000000000000000028", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0fcAdd0000000000000000000000000000000029", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0fcAdd0000000000000000000000000000000030", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0fcAdd0000000000000000000000000000000031", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0fcAdd0000000000000000000000000000000032", estimate: new BigNumber(DISPUTE_CROWDSOURCER_REDEEM_GAS_ESTIMATE, 16) },
                ],
                initialReporterRedeem: [
                  { address: "0xf1Add00000000000000000000000000000000000", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0f1Add0000000000000000000000000000000001", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0f1Add0000000000000000000000000000000002", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0f1Add0000000000000000000000000000000003", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0f1Add0000000000000000000000000000000004", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0f1Add0000000000000000000000000000000005", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0f1Add0000000000000000000000000000000006", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0f1Add0000000000000000000000000000000007", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0f1Add0000000000000000000000000000000008", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0f1Add0000000000000000000000000000000009", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0f1Add0000000000000000000000000000000010", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0f1Add0000000000000000000000000000000011", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0f1Add0000000000000000000000000000000012", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0f1Add0000000000000000000000000000000013", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0f1Add0000000000000000000000000000000014", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0f1Add0000000000000000000000000000000015", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                  { address: "0x0f1Add0000000000000000000000000000000016", estimate: new BigNumber(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE, 16) },
                ],
                totals: {
                  disavowCrowdsourcers: disavowCrowdsourcersTotal,
                  migrateThroughOneFork: migrateThroughOneForkTotal,
                  crowdsourcerForkAndRedeem: crowdsourcerForkAndRedeemTotal,
                  initialReporterForkAndRedeem: initialReporterForkAndRedeemTotal,
                  feeWindowRedeem: feeWindowRedeemTotal,
                  crowdsourcerRedeem: crowdsourcerRedeemTotal,
                  initialReporterRedeem: initialReporterRedeemTotal,
                  all: disavowCrowdsourcersTotal
                      .plus(migrateThroughOneForkTotal)
                      .plus(crowdsourcerForkAndRedeemTotal)
                      .plus(initialReporterForkAndRedeemTotal)
                      .plus(feeWindowRedeemTotal)
                      .plus(crowdsourcerRedeemTotal)
                      .plus(initialReporterRedeemTotal),
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
          feeWindowRedeemStub = sinon.stub(api().FeeWindow, "redeem").callsFake(function (p) { p.onSuccess(FEE_WINDOW_REDEEM_GAS_ESTIMATE); });
          initialReporterForkAndRedeemStub = sinon.stub(api().InitialReporter, "forkAndRedeem").callsFake(function (p) { p.onSuccess(INITIAL_REPORTER_FORK_AND_REDEEM_GAS_ESTIMATE); });
          initialReporterRedeemStub = sinon.stub(api().InitialReporter, "redeem").callsFake(function (p) { p.onSuccess(INITIAL_REPORTER_REDEEM_GAS_ESTIMATE); });
          marketDisavowCrowdsourcersStub = sinon.stub(api().Market, "disavowCrowdsourcers").callsFake(function (p) { p.onSuccess(MARKET_DISAVOW_CROWDSOURCERS_GAS_ESTIMATE); });
          marketMigrateThroughOneForkStub = sinon.stub(api().Market, "migrateThroughOneFork").callsFake(function (p) { p.onSuccess(MARKET_MIGRATE_THROUGH_ONE_FORK_GAS_ESTIMATE); });
          claimReportingFees = proxyquire("../../../src/reporting/claim-reporting-fees", {
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
          it("should be called 1 time", function () {
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
          it("should be called once for every dispute crowdsourcer belonging to a non-forked market or belonging to the forked market and having had its DisputeCrowdsourcer.fork function caled", function () {
            sinon.assert.callCount(disputeCrowdsourcerRedeemStub, 33);
          });
          it("should receive the expected input parameters for each call to DisputeCrowdsourcer.redeem", function () {
            var expectedDisputeCrowdsourcerRedeemAddresses = [
              "0xfcAdd00000000000000000000000000000000001",
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
              "0x0fcAdd0000000000000000000000000000000017",
              "0x0fcAdd0000000000000000000000000000000018",
              "0x0fcAdd0000000000000000000000000000000019",
              "0x0fcAdd0000000000000000000000000000000020",
              "0x0fcAdd0000000000000000000000000000000021",
              "0x0fcAdd0000000000000000000000000000000022",
              "0x0fcAdd0000000000000000000000000000000023",
              "0x0fcAdd0000000000000000000000000000000024",
              "0x0fcAdd0000000000000000000000000000000025",
              "0x0fcAdd0000000000000000000000000000000026",
              "0x0fcAdd0000000000000000000000000000000027",
              "0x0fcAdd0000000000000000000000000000000028",
              "0x0fcAdd0000000000000000000000000000000029",
              "0x0fcAdd0000000000000000000000000000000030",
              "0x0fcAdd0000000000000000000000000000000031",
              "0x0fcAdd0000000000000000000000000000000032",
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

        describe("InitialReporter.forkAndRedeem", function () {
          it("should be called 0 times", function () {
            sinon.assert.notCalled(initialReporterForkAndRedeemStub);
          });
        });

        describe("InitialReporter.redeem", function () {
          it("should be called once for every initial reporter belonging to a non-forked market or belonging to the forked market and having had its InitialReporter.fork function caled", function () {
            sinon.assert.callCount(initialReporterRedeemStub, 17);
          });
          it("should receive the expected input parameters for each call to InitialReport.redeem", function () {
            var expectedInitialReportRedeemAddresses = [
              "0xf1Add00000000000000000000000000000000000",
              "0x0f1Add0000000000000000000000000000000001",
              "0x0f1Add0000000000000000000000000000000002",
              "0x0f1Add0000000000000000000000000000000003",
              "0x0f1Add0000000000000000000000000000000004",
              "0x0f1Add0000000000000000000000000000000005",
              "0x0f1Add0000000000000000000000000000000006",
              "0x0f1Add0000000000000000000000000000000007",
              "0x0f1Add0000000000000000000000000000000008",
              "0x0f1Add0000000000000000000000000000000009",
              "0x0f1Add0000000000000000000000000000000010",
              "0x0f1Add0000000000000000000000000000000011",
              "0x0f1Add0000000000000000000000000000000012",
              "0x0f1Add0000000000000000000000000000000013",
              "0x0f1Add0000000000000000000000000000000014",
              "0x0f1Add0000000000000000000000000000000015",
              "0x0f1Add0000000000000000000000000000000016",
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
          it("should be called once for every non-forked, non-finalized, non-migrated market in the same universe as the forked market", function () {
            sinon.assert.callCount(marketDisavowCrowdsourcersStub, 2);

          });
          it("should receive the expected input parameters for each call to Market.migrateThroughOneFork", function () {
            for (var i = 0; i < marketDisavowCrowdsourcersStub.callCount; i++) {
              var expectedMarketMigrateThroughOneForkAddresses = [
                "0x0fAdd00000000000000000000000000000000001",
                "0x0fAdd00000000000000000000000000000000003",
              ];
              var expectedInput = {
                tx: {
                  to: expectedMarketMigrateThroughOneForkAddresses[i],
                  estimateGas: false,
                },
              };
              var actualInput = marketDisavowCrowdsourcersStub.args[i][0];
              assert.deepEqual(expectedInput.tx, actualInput.tx);
            }
          });
        });

        describe("Market.migrateThroughOneFork", function () {
          it("should not be called", function () {
            sinon.assert.notCalled(marketMigrateThroughOneForkStub);
          });
        });

        describe("returned object", function () {
          it("should contain the expected gas estimates", function () {
            var expectedResult = {
              successfulTransactions: {
                disavowCrowdsourcers: [
                  "0x0fAdd00000000000000000000000000000000001",
                  "0x0fAdd00000000000000000000000000000000003",
                ],
                migrateThroughOneFork: [],
                crowdsourcerForkAndRedeem: ["0xfcAdd00000000000000000000000000000000002"],
                initialReporterForkAndRedeem: [],
                feeWindowRedeem: ["0xfeeAdd0000000000000000000000000000000001"],
                crowdsourcerRedeem: [
                  "0xfcAdd00000000000000000000000000000000001",
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
                  "0x0fcAdd0000000000000000000000000000000017",
                  "0x0fcAdd0000000000000000000000000000000018",
                  "0x0fcAdd0000000000000000000000000000000019",
                  "0x0fcAdd0000000000000000000000000000000020",
                  "0x0fcAdd0000000000000000000000000000000021",
                  "0x0fcAdd0000000000000000000000000000000022",
                  "0x0fcAdd0000000000000000000000000000000023",
                  "0x0fcAdd0000000000000000000000000000000024",
                  "0x0fcAdd0000000000000000000000000000000025",
                  "0x0fcAdd0000000000000000000000000000000026",
                  "0x0fcAdd0000000000000000000000000000000027",
                  "0x0fcAdd0000000000000000000000000000000028",
                  "0x0fcAdd0000000000000000000000000000000029",
                  "0x0fcAdd0000000000000000000000000000000030",
                  "0x0fcAdd0000000000000000000000000000000031",
                  "0x0fcAdd0000000000000000000000000000000032",
                ],
                initialReporterRedeem: [
                  "0xf1Add00000000000000000000000000000000000",
                  "0x0f1Add0000000000000000000000000000000001",
                  "0x0f1Add0000000000000000000000000000000002",
                  "0x0f1Add0000000000000000000000000000000003",
                  "0x0f1Add0000000000000000000000000000000004",
                  "0x0f1Add0000000000000000000000000000000005",
                  "0x0f1Add0000000000000000000000000000000006",
                  "0x0f1Add0000000000000000000000000000000007",
                  "0x0f1Add0000000000000000000000000000000008",
                  "0x0f1Add0000000000000000000000000000000009",
                  "0x0f1Add0000000000000000000000000000000010",
                  "0x0f1Add0000000000000000000000000000000011",
                  "0x0f1Add0000000000000000000000000000000012",
                  "0x0f1Add0000000000000000000000000000000013",
                  "0x0f1Add0000000000000000000000000000000014",
                  "0x0f1Add0000000000000000000000000000000015",
                  "0x0f1Add0000000000000000000000000000000016",
                ],
              },
            };

            assert.deepEqual(expectedResult, claimReportingFeesResult);
          });
        });
      });
    });
  });
});
