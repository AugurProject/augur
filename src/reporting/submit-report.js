"use strict";

var abi = require("augur-abi");
var fixReport = require("./format/fix-report");
var api = require("../api");
var isObject = require("../utils/is-object");

// { event, salt, report, ethics, minValue, maxValue, type, isIndeterminate }
function submitReport(p) {
  return api().MakeReports.submitReport({
    event: p.event,
    salt: abi.hex(p.salt),
    report: fixReport(p.report, p.minValue, p.maxValue, p.type, p.isIndeterminate),
    ethics: p.ethics,
    onSent: p.onSent,
    onSuccess: p.onSuccess,
    onFailed: p.onFailed
  });
}

module.exports = submitReport;
