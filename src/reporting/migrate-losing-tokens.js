"use strict";

var augurContracts = require("augur-contracts");
var api = require("../api");
var rpcInterface = require("../rpc-interface");
var getLogs = require("../logs/get-logs");

// { branchID, marketID }
function migrateLosingTokens(p) {
  api().Branch.getPreviousReportingWindow({ tx: { to: p.branchID } }, function (previousReportingWindowAddress) {
    api().ReportingWindow.getStartBlock({ tx: { to: previousReportingWindowAddress } }, function (previousReportingWindowStartBlock) {
      api().ReportingWindow.getEndBlock({ tx: { to: previousReportingWindowAddress } }, function (previousReportingWindowEndBlock) {
        getLogs({
          label: "Transfer",
          filter: {
            fromBlock: previousReportingWindowStartBlock,
            toBlock: previousReportingWindowEndBlock,
            market: p.marketID,
            address: augurContracts[rpcInterface.getNetworkID()].ReputationToken
          }
        }, function (err, transferLogs) {
          if (err) return p.onFailed(err);
          if (!Array.isArray(transferLogs) || !transferLogs.length) return p.onSuccess(null);
          transferLogs.forEach(function (transferLog) {
            var reportingTokenContractAddress = transferLog.to;
            api().ReportingToken.migrateLosingTokens({
              _signer: p._signer,
              tx: { to: reportingTokenContractAddress, send: true },
              onSent: p.onSent,
              onSuccess: p.onSuccess,
              onFailed: p.onFailed
            });
          });
        });
      });
    });
  });
}

module.exports = migrateLosingTokens;
