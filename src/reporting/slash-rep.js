"use strict";

var abi = require("augur-abi");
var api = require("../api");
var fixReport = require("./fix-report");
var isObject = require("../utils/is-object");

function slashRep(branch, salt, report, reporter, eventID, minValue, maxValue, type, isIndeterminate, isUnethical, onSent, onSuccess, onFailed) {
  if (isObject(branch)) {
    salt = branch.salt;
    report = branch.report;
    reporter = branch.reporter;
    eventID = branch.eventID;
    minValue = branch.minValue;
    maxValue = branch.maxValue;
    type = branch.type;
    isIndeterminate = branch.isIndeterminate;
    isUnethical = branch.isUnethical;
    onSent = branch.onSent;
    onSuccess = branch.onSuccess;
    onFailed = branch.onFailed;
    branch = branch.branch;
  }
  return api.SlashRep.slashRep({
    branch: branch,
    salt: abi.hex(salt),
    report: fixReport(report, minValue, maxValue, type, isIndeterminate),
    reporter: reporter,
    eventID: eventID,
    onSent: onSent,
    onSuccess: onSuccess,
    onFailed: onFailed
  });
}

module.exports = slashRep;
