"use strict";

function depleteOtherShareBalances(outcomeID, sharesDepleted, shareBalances) {
  var numOutcomes = shareBalances.length;
  var depletedShareBalances = new Array(numOutcomes);
  for (var i = 1; i <= numOutcomes; ++i) {
    depletedShareBalances[i - 1] = (i === outcomeID) ? shareBalances[i - 1] : shareBalances[i - 1].minus(sharesDepleted);
  }
  return depletedShareBalances;
}

module.exports = depleteOtherShareBalances;
