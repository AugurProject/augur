"use strict";

var penaltyCatchUp = require("./penalty-catch-up");
var getCurrentPeriodProgress = require("../get-current-period-progress");
var api = require("../../api");
var noop = require("../../utils/noop");

// If reported last period and called collectfees then call the penalization functions in
// consensus [i.e. penalizeWrong], if didn't report last period or didn't call collectfees
// last period then call penalizationCatchup in order to allow submitReportHash to work.
function feePenaltyCatchUp(branch, periodLength, periodToCheck, sender, callback) {
  api.ConsensusData.getPenalizedUpTo(branch, sender, function (lastPeriodPenalized) {
    lastPeriodPenalized = parseInt(lastPeriodPenalized, 10);
    api.ConsensusData.getFeesCollected(branch, sender, lastPeriodPenalized, function (feesCollected) {
      if (!feesCollected || feesCollected.error) {
        return callback(feesCollected || "couldn't get fees collected");
      }
      if (feesCollected === "1") {
        return penaltyCatchUp(branch, periodLength, periodToCheck, sender, callback);
      }
      if (getCurrentPeriodProgress(periodLength) < 50) {
        return penaltyCatchUp(branch, periodLength, periodToCheck, sender, callback);
      }
      api.CollectFees.collectFees({
        branch: branch,
        sender: sender,
        periodLength: periodLength,
        onSent: noop,
        onSuccess: function () {
          penaltyCatchUp(branch, periodLength, periodToCheck, sender, callback);
        },
        onFailed: function (e) {
          if (e.error !== "-1") return callback(e);
          penaltyCatchUp(branch, periodLength, periodToCheck, sender, callback);
        }
      });
    });
  });
}

module.exports = feePenaltyCatchUp;
