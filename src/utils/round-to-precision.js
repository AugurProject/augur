"use strict";

var ROUND_DOWN = require("bignumber.js").ROUND_DOWN;
var PRECISION = require("../constants").PRECISION;

function roundToPrecision(value, minimum, round, roundingMode) {
  var absValue = value.abs();
  if (absValue.lt(minimum || PRECISION.zero)) return null;
  if (absValue.lt(PRECISION.limit)) {
    value = value.toPrecision(PRECISION.decimals, roundingMode || ROUND_DOWN);
  } else {
    value = value.times(PRECISION.multiple)[round || "floor"]().dividedBy(PRECISION.multiple).toFixed();
  }
  return value;
}

module.exports = roundToPrecision;
