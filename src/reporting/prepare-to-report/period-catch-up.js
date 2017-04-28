"use strict";

var assign = require("lodash.assign");
var getCurrentPeriod = require("../get-current-period");
var api = require("../../api");
var noop = require("../../utils/noop");

function periodCatchUp(p, branch, periodLength, callback) {
  api().Branches.getVotePeriod({ branch: branch }, function (votePeriod) {
    if (votePeriod < getCurrentPeriod(periodLength) - 1) {
      api().Consensus.incrementPeriodAfterReporting(assign({}, p, {
        branch: branch,
        onSent: noop,
        onSuccess: function () {
          periodCatchUp(p, branch, periodLength, callback);
        },
        onFailed: callback
      }));
    } else {
      callback(null, votePeriod);
    }
  });
}

module.exports = periodCatchUp;
