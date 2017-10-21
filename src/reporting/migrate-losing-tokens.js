"use strict";

var async = require("async");
var api = require("../api");
var getLogs = require("../events/get-logs");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.universeID Universe on which to register to report.
 * @param {string} p.market Address of the market to redeem Reporting tokens from, as a hex string.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called if/when the transaction is broadcast to the network.
 * @param {function} p.onSuccess Called if/when the transaction is sealed and confirmed.
 * @param {function} p.onFailed Called if/when the transaction fails.
 */
function migrateLosingTokens(p) {
  var universePayload = { tx: { to: p.universeID } };
  async.parallel({
    reputationToken: function (next) {
      api().Universe.getReputationToken(universePayload, function (err, reputationTokenAddress) {
        if (err) return next(err);
        next(null, reputationTokenAddress);
      });
    },
    previousReportingWindow: function (next) {
      api().Universe.getPreviousReportingWindow(universePayload, function (err, previousReportingWindowAddress) {
        if (err) return next(err);
        next(null, previousReportingWindowAddress);
      });
    }
  }, function (err, contractAddresses) {
    if (err) return p.onFailed(err);
    var previousReportingWindowPayload = { tx: { to: contractAddresses.previousReportingWindow } };
    async.parallel({
      previousReportingWindowStartBlock: function (next) {
        api().ReportingWindow.getStartBlock(previousReportingWindowPayload, function (err, previousReportingWindowStartBlock) {
          if (err) return next(err);
          next(null, previousReportingWindowStartBlock);
        });
      },
      previousReportingWindowEndBlock: function (next) {
        api().ReportingWindow.getEndBlock(previousReportingWindowPayload, function (err, previousReportingWindowEndBlock) {
          if (err) return next(err);
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
          market: p.market,
          address: contractAddresses.reputationToken
        }
      }, function (err, transferLogs) {
        if (err) return p.onFailed(err);
        if (!Array.isArray(transferLogs) || !transferLogs.length) return p.onSuccess(null);
        transferLogs.forEach(function (transferLog) {
          var stakeTokenAddress = transferLog.to;
          api().StakeToken.migrateLosingTokens({
            _signer: p._signer,
            tx: { to: stakeTokenAddress },
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
