"use strict";

var abi = require("augur-abi");
var constants = require("../constants");

isIndeterminateReport: function (fxpReport, type) {
  var bnFxpReport = abi.bignum(fxpReport);
  if (type === "binary" && bnFxpReport.eq(constants.BINARY_INDETERMINATE)) {
    return "1.5";
  } else if (bnFxpReport.eq(constants.CATEGORICAL_SCALAR_INDETERMINATE)) {
    return "0.5";
  }
  return false;
}

module.exports = isIndeterminateReport;
