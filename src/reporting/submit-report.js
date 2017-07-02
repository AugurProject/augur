"use strict";

var api = require("../api");

// { marketID, payoutNumerators, amountToStake }
function submitReport(p) {
  api().Market.getReportingToken({
    tx: { to: p.marketID },
    payoutNumerators: p.payoutNumerators
  }, function (reportingTokenAddress) {
    api().ReportingToken.buy({
      _signer: p._signer,
      tx: { to: reportingTokenAddress, send: true },
      amountToStake: p.amountToStake,
      onSent: p.onSent,
      onSuccess: p.onSuccess,
      onFailed: p.onFailed
    });
  });
}

module.exports = submitReport;
