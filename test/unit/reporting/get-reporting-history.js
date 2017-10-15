/* eslint-env mocha */

"use strict";

// var assert = require("chai").assert;
// var proxyquire = require("proxyquire").noPreserveCache();

describe("logs/get-reporting-history", function () {
  // var test = function (t) {
  //   it(t.description, function (done) {
  //     var getReportingHistory = proxyquire("../../../src/logs/get-reporting-history", {
  //       "./get-logs-chunked": t.stub.getLogsChunked,
  //       "../api": t.stub.api
  //     });
  //     getReportingHistory(t.params, function (err, reportingHistory) {
  //       t.assertions(err, reportingHistory);
  //       done();
  //     });
  //   });
  // };
  // test({
  //   description: "get full reporting history",
  //   params: {
  //     fromBlock: "0x1",
  //     toBlock: "latest"
  //   },
  //   stub: {
  //     getLogsChunked: function (p, onChunkReceived, onComplete) {
  //       switch (p.label) {
  //         case "SubmitReport":
  //           assert.deepEqual(p.filter, { fromBlock: "0x1", toBlock: "latest" });
  //           assert.deepEqual(p.aux, { index: "market" });
  //           onComplete(null, {
  //             MARKET_ADDRESS: [{
  //               reporter: "REPORTER_ADDRESS",
  //               market: "MARKET_ADDRESS",
  //               amountStaked: "10",
  //               stakeToken: "STAKE_TOKEN_ADDRESS",
  //               payoutNumerators: ["0", "1", "0", "0"]
  //             }]
  //           });
  //           break;
  //         case "RedeemWinningTokens":
  //           assert.deepEqual(p.filter, { market: "MARKET_ADDRESS", fromBlock: "0x1", toBlock: "latest" });
  //           onComplete(null, [{
  //             reporter: "REPORTER_ADDRESS",
  //             market: "MARKET_ADDRESS",
  //             payoutNumerators: ["0", "1", "0", "0"],
  //             amountRedeemed: "10",
  //             reportingFeesReceived: "7"
  //           }]);
  //           break;
  //         default:
  //           assert.fail();
  //       }
  //     },
  //     api: function () {
  //       return {
  //         Market: {
  //           getFinalWinningStakeToken: function (p, callback) {
  //             assert.deepEqual(p, { tx: { to: "MARKET_ADDRESS" } });
  //             callback(null, "0x2a");
  //           },
  //           getFinalizationTime: function (p, callback) {
  //             assert.deepEqual(p, { tx: { to: "MARKET_ADDRESS" } });
  //             callback(null, "0x499602d2");
  //           }
  //         },
  //         StakeToken: {
  //           getPayoutNumerators: function (p, callback) {
  //             callback(null, ["0x0", "0x1", "0x0", "0x0"]);
  //           }
  //         }
  //       };
  //     }
  //   },
  //   assertions: function (err, reportingHistory) {
  //     assert.isNull(err);
  //     assert.deepEqual(reportingHistory, {
  //       MARKET_ADDRESS: [{
  //         reporter: "REPORTER_ADDRESS",
  //         market: "MARKET_ADDRESS",
  //         amountStaked: "10",
  //         stakeToken: "STAKE_TOKEN_ADDRESS",
  //         payoutNumerators: ["0", "1", "0", "0"],
  //         winningPayoutNumerators: ["0", "1", "0", "0"],
  //         isReportCorrect: true,
  //         finalWinningStakeToken: "0x2a",
  //         finalizationTime: 1234567890,
  //         amountRedeemed: "10",
  //         reportingFeesReceived: "7"
  //       }]
  //     });
  //   }
  // });
});
