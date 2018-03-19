"use strict";

var BigNumber = require("bignumber.js");
var ROUND_DOWN = BigNumber.ROUND_DOWN;
var ROUND_CEIL = BigNumber.ROUND_CEIL;
var ROUND_FLOOR = BigNumber.ROUND_FLOOR;
var PRECISION = require("../constants").PRECISION;

function roundToPrecision(value, minimum, round, roundingMode) {
  var absValue = value.abs();
  if (absValue.lt(minimum || PRECISION.zero)) return null;
  if (absValue.lt(PRECISION.limit)) {
    value = value.toPrecision(PRECISION.decimals, roundingMode || ROUND_DOWN);
  } else {
    if (round === "ceil") {
      roundingMode = ROUND_CEIL;
    } else if (round === "floor") {
      roundingMode = ROUND_FLOOR;
    }
    value = value.times(PRECISION.multiple).integerValue(roundingMode).dividedBy(PRECISION.multiple).toFixed();
  }
  return value;
}

module.exports = roundToPrecision;
