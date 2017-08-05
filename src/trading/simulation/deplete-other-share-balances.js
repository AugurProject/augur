"use strict";

function depleteOtherShareBalances(outcomeID, sharesDepleted, shareBalances) {
  for (var i = 1; i <= shareBalances.length; ++i) {
    if (i !== outcomeID) {
      shareBalances[i - 1] = shareBalances[i - 1].minus(sharesDepleted);
    }
  }
  return shareBalances;
}

module.exports = depleteOtherShareBalances;
