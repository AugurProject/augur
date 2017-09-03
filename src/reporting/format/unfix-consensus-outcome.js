"use strict";

var speedomatic = require("speedomatic");
var BigNumber = require("bignumber.js");
var isIndeterminateConsensusOutcome = require("./is-indeterminate-consensus-outcome");
var isSpecialValueConsensusOutcome = require("./is-special-value-consensus-outcome");

function unfixConsensusOutcome(fxpConsensusOutcome, minValue, maxValue, type) {
  var bnMinValue, bnMaxValue, consensusOutcome, indeterminateConsensusOutcome, specialValueConsensusOutcome;
  bnMinValue = new BigNumber(minValue, 10);
  bnMaxValue = new BigNumber(maxValue, 10);
  consensusOutcome = speedomatic.unfixSigned(fxpConsensusOutcome);
  indeterminateConsensusOutcome = isIndeterminateConsensusOutcome(consensusOutcome, bnMinValue, bnMaxValue);
  if (indeterminateConsensusOutcome) {
    return { outcomeID: indeterminateConsensusOutcome, isIndeterminate: true };
  }
  if (type !== "binary") {
    specialValueConsensusOutcome = isSpecialValueConsensusOutcome(fxpConsensusOutcome, bnMinValue, bnMaxValue);
    if (specialValueConsensusOutcome) {
      return { outcomeID: specialValueConsensusOutcome, isIndeterminate: false };
    }
  }
  return { outcomeID: consensusOutcome.toFixed(), isIndeterminate: false };
}

module.exports = unfixConsensusOutcome;
