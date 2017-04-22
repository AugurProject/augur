"use strict";

// So in the scenario where it's indeterminate getUncaughtOutcome will be 0.5*10^18 and getOutcome will be middle of the range, so if range is 0-200 it'll be 100*10^18
// When it's not indeterminate and it lands halfway getUncaughtOutcome should be 0.5*10^18 + 1 and getOutcome will be like 100*10^18 + some fraction of a quadrillionth or so
// Like how 0 outcomes should report 1 (which is some super tiny fraction)
// When it's determinate to differentiate for scalars and categoricals it should be .5*fxp + 1
// And for differentiating for indeterminate, indeterminate ones should be .5*fxp
function isIndeterminateConsensusOutcome(consensusOutcome, minValue, maxValue) {
  if (consensusOutcome.eq(maxValue.plus(minValue).dividedBy(2))) {
    return consensusOutcome.toFixed();
  }
  return false;
}

module.exports = isIndeterminateConsensusOutcome;
