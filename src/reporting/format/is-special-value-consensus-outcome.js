"use strict";

var speedomatic = require("speedomatic");

function isSpecialValueConsensusOutcome(fxpConsensusOutcome, minValue, maxValue) {
  var bnFxpConsensusOutcome, meanValue;
  bnFxpConsensusOutcome = speedomatic.bignum(fxpConsensusOutcome);
  if (bnFxpConsensusOutcome.eq(1)) {
    return "0";
  }
  meanValue = speedomatic.fix(maxValue).plus(speedomatic.fix(minValue)).dividedBy(2);
  if (bnFxpConsensusOutcome.eq(meanValue.plus(1))) {
    return speedomatic.unfix(meanValue, "string");
  }
  return false;
}

module.exports = isSpecialValueConsensusOutcome;
