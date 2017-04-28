"use strict";

var abi = require("augur-abi");

function isSpecialValueConsensusOutcome(fxpConsensusOutcome, minValue, maxValue) {
  var bnFxpConsensusOutcome, meanValue;
  bnFxpConsensusOutcome = abi.bignum(fxpConsensusOutcome);
  if (bnFxpConsensusOutcome.eq(1)) {
    return "0";
  }
  meanValue = abi.fix(maxValue).plus(abi.fix(minValue)).dividedBy(2);
  if (bnFxpConsensusOutcome.eq(meanValue.plus(1))) {
    return abi.unfix(meanValue, "string");
  }
  return false;
}

module.exports = isSpecialValueConsensusOutcome;
