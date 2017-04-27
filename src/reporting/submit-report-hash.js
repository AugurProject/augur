"use strict";

var abi = require("augur-abi");
var getCurrentPeriodProgress = require("./get-current-period-progress");
var prepareToReport = require("./prepare-to-report");
var api = require("../api");
var isObject = require("../utils/is-object");

// { event, reportHash, encryptedReport, encryptedSalt, ethics, branch, period, periodLength, onSent, onSuccess, onFailed }
function submitReportHash(p) {
  if (getCurrentPeriodProgress(p.periodLength) >= 50) {
    return p.onFailed({ "-2": "not in first half of period (commit phase)" });
  }
  return api().MakeReports.submitReportHash({
    event: p.event,
    reportHash: p.reportHash,
    encryptedReport: p.encryptedReport || 0,
    encryptedSalt: p.encryptedSalt || 0,
    ethics: abi.fix(p.ethics, "hex"),
    onSent: p.onSent,
    onSuccess: function (res) {
      res.callReturn = abi.bignum(res.callReturn, "string", true);
      if (res.callReturn === "0") {
        return prepareToReport(p.branch, p.periodLength, res.from, function (err) {
          if (err) return p.onFailed(err);
          api().ConsensusData.getRepRedistributionDone({
            branch: p.branch,
            reporter: res.from,
            callback: function (repRedistributionDone) {
              if (repRedistributionDone === "0") {
                return p.onFailed("Rep redistribution not done");
              }
              submitReportHash(p);
            }
          });
        });
      } else if (res.callReturn !== "-2") {
        return p.onSuccess(res);
      }
      api().ExpiringEvents.getReportHash({
        branch: p.branch,
        expDateIndex: p.period,
        reporter: res.from,
        event: p.event,
      }, function (storedReportHash) {
        if (parseInt(storedReportHash, 16)) {
          res.callReturn = "1";
          return p.onSuccess(res);
        }
        onFailed({ "-2": "not in first half of period (commit phase)" });
      });
    },
    onFailed: p.onFailed
  });
}

module.exports = submitReportHash;
