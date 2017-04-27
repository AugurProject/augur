"use strict";

var abi = require("augur-abi");
var api = require("../api");
var fixReport = require("./format/fix-report");
var isObject = require("../utils/is-object");

// branch, salt, report, reporter, eventID, minValue, maxValue, type, isIndeterminate, isUnethical, onSent, onSuccess, onFailed
function slashRep(p) {
  return api().SlashRep.slashRep({
    branch: p.branch,
    salt: abi.hex(p.salt),
    report: fixReport(p.report, p.minValue, p.maxValue, p.type, p.isIndeterminate),
    reporter: p.reporter,
    eventID: p.eventID,
    onSent: p.onSent,
    onSuccess: p.onSuccess,
    onFailed: p.onFailed
  });
}

module.exports = slashRep;
