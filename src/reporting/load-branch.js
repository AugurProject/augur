"use strict";

var abi = require("augur-abi");
var api = require("../api");

function finishLoadBranch(branch, callback) {
  if (branch.periodLength && branch.description && branch.baseReporters) {
    callback(null, branch);
  }
}

function loadBranch(branchID, callback) {
  var branch = { id: abi.hex(branchID) };
  api().Branches.getPeriodLength(branchID, function (periodLength) {
    if (!periodLength || periodLength.error) return callback(periodLength);
    branch.periodLength = periodLength;
    finishLoadBranch(branch, callback);
  });
  api().Info.getDescription(branchID, function (description) {
    if (!description || description.error) return callback(description);
    branch.description = description;
    finishLoadBranch(branch, callback);
  });
  api().Branches.getBaseReporters(branchID, function (baseReporters) {
    if (!baseReporters || baseReporters.error) return callback(baseReporters);
    branch.baseReporters = parseInt(baseReporters, 10);
    finishLoadBranch(branch, callback);
  });
}

module.exports = loadBranch;
