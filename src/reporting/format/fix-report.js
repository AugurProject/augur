"use strict";

var speedomatic = require("speedomatic");
var constants = require("../../constants");

// rules: http://docs.augur.net/#reporting-outcomes
function fixReport(report, minValue, maxValue, type, isIndeterminate) {
  var fixedReport, rescaledReport, bnMinValue;
  if (isIndeterminate) {
    if (type === "binary") {
      fixedReport = speedomatic.hex(constants.BINARY_INDETERMINATE);
    } else {
      fixedReport = speedomatic.hex(constants.CATEGORICAL_SCALAR_INDETERMINATE);
    }
  } else {
    if (type === "binary") {
      fixedReport = speedomatic.fix(report, "hex");
    } else {
      // y = (x - min)/(max - min)
      bnMinValue = speedomatic.bignum(minValue);
      rescaledReport = speedomatic.bignum(report).minus(bnMinValue).dividedBy(
        speedomatic.bignum(maxValue).minus(bnMinValue)
      );
      if (rescaledReport.eq(constants.ZERO)) {
        fixedReport = "0x1";
      } else {
        fixedReport = speedomatic.fix(rescaledReport, "hex");
      }
    }

    // if report is equal to fix(0.5) but is not indeterminate,
    // then set report to fix(0.5) + 1
    if (speedomatic.bignum(fixedReport).eq(constants.CATEGORICAL_SCALAR_INDETERMINATE)) {
      fixedReport = speedomatic.hex(constants.INDETERMINATE_PLUS_ONE);
    }
  }
  return fixedReport;
}

module.exports = fixReport;
