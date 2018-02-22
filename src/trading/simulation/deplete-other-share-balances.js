"use strict";

function depleteOtherShareBalances(outcomeId, sharesDepleted, shareBalances) {
  var numOutcomes = shareBalances.length;
  var depletedShareBalances = new Array(numOutcomes);
  for (var i = 0; i < numOutcomes; ++i) {
    depletedShareBalances[i] = (i === outcomeId) ? shareBalances[i] : shareBalances[i].minus(sharesDepleted);
  }
  return depletedShareBalances;
}

module.exports = depleteOtherShareBalances;
