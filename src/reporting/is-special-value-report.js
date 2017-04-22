"use strict";

var abi = require("augur-abi");
var INDETERMINATE_PLUS_ONE = require("../constants").INDETERMINATE_PLUS_ONE;

function isSpecialValueReport(fxpReport) {
  var bnFxpReport = abi.bignum(fxpReport);
  if (bnFxpReport.eq(1)) {
    return "0";
  }
  if (bnFxpReport.eq(INDETERMINATE_PLUS_ONE)) {
    return "0.5";
  }
  return false;
}

module.exports = isSpecialValueReport;
