"use strict";

var unfixReport = require("./format/unfix-report");
var api = require("../api");
var isObject = require("../utils/is-object");
var errors = require("../rpc-interface").errors;

// { branch, period, event, sender, minValue, maxValue, type }
function getReport(p, callback) {
  api().ExpiringEvents.getReport({
    branch: p.branch,
    period: p.period,
    event: p.event,
    sender: p.sender
  }, function (rawReport) {
    if (!rawReport || rawReport.error) {
      return callback(rawReport || errors.REPORT_NOT_FOUND);
    }
    if (!parseInt(rawReport, 16)) {
      return callback({ report: "0", isIndeterminate: false });
    }
    callback(unfixReport(rawReport, minValue, maxValue, type));
  });
}

module.exports = getReport;
