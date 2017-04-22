"use strict";

var abi = require("augur-abi");
var isIndeterminateReport = require("./is-indeterminate-report");
var isSpecialValueReport = require("./is-special-value-report");

function unfixReport(rawReport, minValue, maxValue, type) {
  var report, indeterminateReport, specialValueReport, bnMinValue;
  indeterminateReport = isIndeterminateReport(rawReport, type);
  if (indeterminateReport) {
    return { report: indeterminateReport, isIndeterminate: true };
  }
  if (type === "binary") {
    return { report: abi.unfix(rawReport, "string"), isIndeterminate: false };
  }
  if (type === "scalar") {
    specialValueReport = isSpecialValueReport(rawReport);
    if (specialValueReport) {
      return { report: specialValueReport, isIndeterminate: false };
    }
  }
  // x = (max - min)*y + min
  bnMinValue = abi.bignum(minValue);
  report = abi.unfix(rawReport).times(abi.bignum(maxValue).minus(bnMinValue)).plus(bnMinValue);
  if (type === "categorical") report = report.round();
  return { report: report.toFixed(), isIndeterminate: false };
}

module.exports = unfixReport;
