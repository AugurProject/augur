"use strict";

function depleteOtherShareBalances(outcomeID, sharesDepleted, shareBalances) {
  var numOutcomes = shareBalances.length;
  var depletedShareBalances = new Array(numOutcomes);
  for (var i = 0; i < numOutcomes; ++i) {
    depletedShareBalances[i] = (i === outcomeID) ? shareBalances[i] : shareBalances[i].minus(sharesDepleted);
  }
  return depletedShareBalances;
}

module.exports = depleteOtherShareBalances;
