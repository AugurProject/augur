"use strict";

function modifyOtherShareBalances(outcomeId, sharesDepleted, shareBalances, isIncrease) {
  var numOutcomes = shareBalances.length;
  var modifiedShareBalances = new Array(numOutcomes);
  for (var i = 0; i < numOutcomes; ++i) {
    if (i === outcomeId) {
      modifiedShareBalances[i] = shareBalances[i];
    } else {
      modifiedShareBalances[i] = isIncrease ? shareBalances[i].plus(sharesDepleted) : shareBalances[i].minus(sharesDepleted);
    }
  }
  return modifiedShareBalances;
}

module.exports = modifyOtherShareBalances;
