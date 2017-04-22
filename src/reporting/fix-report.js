"use strict";

var abi = require("augur-abi");
var constants = require("../constants");

// rules: http://docs.augur.net/#reporting-outcomes
function fixReport(report, minValue, maxValue, type, isIndeterminate) {
  var fixedReport, rescaledReport, bnMinValue;
  if (isIndeterminate) {
    if (type === "binary") {
      fixedReport = abi.hex(constants.BINARY_INDETERMINATE);
    } else {
      fixedReport = abi.hex(constants.CATEGORICAL_SCALAR_INDETERMINATE);
    }
  } else {
    if (type === "binary") {
      fixedReport = abi.fix(report, "hex");
    } else {
      // y = (x - min)/(max - min)
      bnMinValue = abi.bignum(minValue);
      rescaledReport = abi.bignum(report).minus(bnMinValue).dividedBy(
        abi.bignum(maxValue).minus(bnMinValue)
      );
      if (rescaledReport.eq(constants.ZERO)) {
        fixedReport = "0x1";
      } else {
        fixedReport = abi.fix(rescaledReport, "hex");
      }
    }

    // if report is equal to fix(0.5) but is not indeterminate,
    // then set report to fix(0.5) + 1
    if (abi.bignum(fixedReport).eq(constants.CATEGORICAL_SCALAR_INDETERMINATE)) {
      fixedReport = abi.hex(constants.INDETERMINATE_PLUS_ONE);
    }
  }
  return fixedReport;
}

module.exports = fixReport;
