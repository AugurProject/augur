"use strict";

var unfixReport = require("./unfix-report");
var api = require("../api");
var isObject = require("../utils/is-object");
var errors = require("../rpc-interface").errors;

function getReport(branch, period, event, sender, minValue, maxValue, type, callback) {
  if (isObject(branch)) {
    period = branch.period;
    event = branch.event;
    sender = branch.sender;
    minValue = branch.minValue;
    maxValue = branch.maxValue;
    type = branch.type;
    callback = callback || branch.callback;
    branch = branch.branch;
  }
  api.ExpiringEvents.getReport(branch, period, event, sender, function (rawReport) {
    if (!rawReport || rawReport.error) {
      return callback(rawReport || errors.REPORT_NOT_FOUND);
    }
    if (!parseInt(rawReport, 16)) {
      return callback({report: "0", isIndeterminate: false});
    }
    callback(unfixReport(rawReport, minValue, maxValue, type));
  });
}

module.exports = getReport;
