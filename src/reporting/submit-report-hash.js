"use strict";

var abi = require("augur-abi");
var getCurrentPeriodProgress = require("./get-current-period-progress");
var checkPeriod = require("./check-period");
var api = require("../api");
var isObject = require("../utils/is-object");

function submitReportHash(event, reportHash, encryptedReport, encryptedSalt, ethics, branch, period, periodLength, onSent, onSuccess, onFailed) {
  if (isObject(event)) {
    reportHash = event.reportHash;
    encryptedReport = event.encryptedReport;
    encryptedSalt = event.encryptedSalt;
    ethics = event.ethics;
    branch = event.branch;
    period = event.period;
    periodLength = event.periodLength;
    onSent = event.onSent;
    onSuccess = event.onSuccess;
    onFailed = event.onFailed;
    event = event.event;
  }
  if (getCurrentPeriodProgress(periodLength) >= 50) {
    return onFailed({"-2": "not in first half of period (commit phase)"});
  }
  return api.MakeReports.submitReportHash({
    event: event,
    reportHash: reportHash,
    encryptedReport: encryptedReport || 0,
    encryptedSalt: encryptedSalt || 0,
    ethics: abi.fix(ethics, "hex"),
    onSent: onSent,
    onSuccess: function (res) {
      res.callReturn = abi.bignum(res.callReturn, "string", true);
      if (res.callReturn === "0") {
        return checkPeriod(branch, periodLength, res.from, function (err) {
          if (err) return onFailed(err);
          api.ConsensusData.getRepRedistributionDone(branch, res.from, function (repRedistributionDone) {
            if (repRedistributionDone === "0") {
              return onFailed("rep redistribution not done");
            }
            submitReportHash({
              event: event,
              reportHash: reportHash,
              encryptedReport: encryptedReport,
              encryptedSalt: encryptedSalt,
              ethics: ethics,
              branch: branch,
              period: period,
              periodLength: periodLength,
              onSent: onSent,
              onSuccess: onSuccess,
              onFailed: onFailed
            });
          });
        });
      } else if (res.callReturn !== "-2") {
        return onSuccess(res);
      }
      api.ExpiringEvents.getReportHash({
        branch: branch,
        expDateIndex: period,
        reporter: res.from,
        event: event,
        callback: function (storedReportHash) {
          if (parseInt(storedReportHash, 16)) {
            res.callReturn = "1";
            return onSuccess(res);
          }
          onFailed({"-2": "not in first half of period (commit phase)"});
        }
      });
    },
    onFailed: onFailed
  });
}

module.exports = submitReportHash;
