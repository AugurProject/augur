"use strict";

var abi = require("augur-abi");
var fixReport = require("./format/fix-report");
var api = require("../api");
var isObject = require("../utils/is-object");

function submitReport(event, salt, report, ethics, minValue, maxValue, type, isIndeterminate, onSent, onSuccess, onFailed) {
  if (isObject(event)) {
    salt = event.salt;
    report = event.report;
    ethics = event.ethics;
    minValue = event.minValue;
    maxValue = event.maxValue;
    type = event.type;
    isIndeterminate = event.isIndeterminate;
    onSent = event.onSent;
    onSuccess = event.onSuccess;
    onFailed = event.onFailed;
    event = event.event;
  }
  return api.MakeReports.submitReport(
    event,
    abi.hex(salt),
    fixReport(report, minValue, maxValue, type, isIndeterminate),
    ethics,
    onSent,
    onSuccess,
    onFailed
  );
}

module.exports = submitReport;
