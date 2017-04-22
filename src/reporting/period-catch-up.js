"use strict";

var getCurrentPeriod = require("./get-current-period");
var periodCatchUp = require("./period-catch-up");
var api = require("../api");
var noop = require("../utils/noop");

function periodCatchUp(branch, periodLength, callback) {
  api.Branches.getVotePeriod(branch, function (votePeriod) {
    if (votePeriod < getCurrentPeriod(periodLength) - 1) {
      api.Consensus.incrementPeriodAfterReporting({
        branch: branch,
        onSent: noop,
        onSuccess: function () {
          periodCatchUp(branch, periodLength, callback);
        },
        onFailed: callback
      });
    } else {
      callback(null, votePeriod);
    }
  });
}

module.exports = periodCatchUp;
