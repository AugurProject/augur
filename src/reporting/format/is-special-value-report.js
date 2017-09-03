"use strict";

var speedomatic = require("speedomatic");
var INDETERMINATE_PLUS_ONE = require("../../constants").INDETERMINATE_PLUS_ONE;

function isSpecialValueReport(fxpReport) {
  var bnFxpReport = speedomatic.bignum(fxpReport);
  if (bnFxpReport.eq(1)) {
    return "0";
  }
  if (bnFxpReport.eq(INDETERMINATE_PLUS_ONE)) {
    return "0.5";
  }
  return false;
}

module.exports = isSpecialValueReport;
