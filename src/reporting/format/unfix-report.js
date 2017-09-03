"use strict";

var speedomatic = require("speedomatic");
var isIndeterminateReport = require("./is-indeterminate-report");
var isSpecialValueReport = require("./is-special-value-report");

function unfixReport(rawReport, minValue, maxValue, type) {
  var report, indeterminateReport, specialValueReport, bnMinValue;
  indeterminateReport = isIndeterminateReport(rawReport, type);
  if (indeterminateReport) {
    return { report: indeterminateReport, isIndeterminate: true };
  }
  if (type === "binary") {
    return { report: speedomatic.unfix(rawReport, "string"), isIndeterminate: false };
  }
  if (type === "scalar") {
    specialValueReport = isSpecialValueReport(rawReport);
    if (specialValueReport) {
      return { report: specialValueReport, isIndeterminate: false };
    }
  }
  // x = (max - min)*y + min
  bnMinValue = speedomatic.bignum(minValue);
  report = speedomatic.unfix(rawReport).times(speedomatic.bignum(maxValue).minus(bnMinValue)).plus(bnMinValue);
  if (type === "categorical") report = report.round();
  return { report: report.toFixed(), isIndeterminate: false };
}

module.exports = unfixReport;
