"use strict";

var speedomatic = require("speedomatic");
var api = require("../api");

function finishLoadBranch(branch, callback) {
  if (branch.periodLength && branch.description && branch.baseReporters) {
    callback(null, branch);
  }
}

function loadBranch(branchID, callback) {
  var branch = { id: speedomatic.hex(branchID) };
  api().Branches.getPeriodLength({ branch: branchID }, function (periodLength) {
    if (!periodLength || periodLength.error) return callback(periodLength);
    branch.periodLength = periodLength;
    finishLoadBranch(branch, callback);
  });
  api().Info.getDescription({ ID: branchID }, function (description) {
    if (!description || description.error) return callback(description);
    branch.description = description;
    finishLoadBranch(branch, callback);
  });
  api().Branches.getBaseReporters({ branch: branchID }, function (baseReporters) {
    if (!baseReporters || baseReporters.error) return callback(baseReporters);
    branch.baseReporters = parseInt(baseReporters, 10);
    finishLoadBranch(branch, callback);
  });
}

module.exports = loadBranch;
