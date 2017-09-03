"use strict";

var speedomatic = require("speedomatic");
var constants = require("../../constants");

function isIndeterminateReport(fxpReport, type) {
  var bnFxpReport = speedomatic.bignum(fxpReport);
  if (type === "binary" && bnFxpReport.eq(constants.BINARY_INDETERMINATE)) {
    return "1.5";
  } else if (bnFxpReport.eq(constants.CATEGORICAL_SCALAR_INDETERMINATE)) {
    return "0.5";
  }
  return false;
}

module.exports = isIndeterminateReport;
