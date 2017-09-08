"use strict";

var async = require("async");
var api = require("../api");
var getLogs = require("../logs/get-logs");

// { branchID, marketID }
function migrateLosingTokens(p) {
  var branchPayload = { tx: { to: p.branchID } };
  async.parallel({
    reputationToken: function (next) {
      api().Branch.getReputationToken(branchPayload, function (reputationTokenAddress) {
        next(null, reputationTokenAddress);
      });
    },
    previousReportingWindow: function (next) {
      api().Branch.getPreviousReportingWindow(branchPayload, function (previousReportingWindowAddress) {
        next(null, previousReportingWindowAddress);
      });
    }
  }, function (err, contractAddresses) {
    if (err) return p.onFailed(err);
    var previousReportingWindowPayload = { tx: { to: contractAddresses.previousReportingWindow } };
    async.parallel({
      previousReportingWindowStartBlock: function (next) {
        api().ReportingWindow.getStartBlock(previousReportingWindowPayload, function (previousReportingWindowStartBlock) {
          next(null, previousReportingWindowStartBlock);
        });
      },
      previousReportingWindowEndBlock: function (next) {
        api().ReportingWindow.getEndBlock(previousReportingWindowPayload, function (previousReportingWindowEndBlock) {
          next(null, previousReportingWindowEndBlock);
        });
      }
    }, function (err, bounds) {
      if (err) return p.onFailed(err);
      getLogs({
        label: "Transfer",
        filter: {
          fromBlock: bounds.previousReportingWindowStartBlock,
          toBlock: bounds.previousReportingWindowEndBlock,
          market: p.marketID,
          address: contractAddresses.reputationToken
        }
      }, function (err, transferLogs) {
        if (err) return p.onFailed(err);
        if (!Array.isArray(transferLogs) || !transferLogs.length) return p.onSuccess(null);
        transferLogs.forEach(function (transferLog) {
          var reportingTokenAddress = transferLog.to;
          api().ReportingToken.migrateLosingTokens({
            _signer: p._signer,
            tx: { to: reportingTokenAddress, send: true },
            onSent: p.onSent,
            onSuccess: p.onSuccess,
            onFailed: p.onFailed
          });
        });
      });
    });
  });
}

module.exports = migrateLosingTokens;
