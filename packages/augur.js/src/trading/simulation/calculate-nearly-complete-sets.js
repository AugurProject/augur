"use strict";

var BigNumber = require("bignumber.js");

function calculateNearlyCompleteSets(outcomeId, desiredShares, shareBalances, takerSharesDepleted) {
  var sharesAvailable = desiredShares;
  for (var i = 0; i < shareBalances.length; ++i) {
    if (i !== outcomeId) {
      sharesAvailable = BigNumber.min(shareBalances[i].minus(takerSharesDepleted), sharesAvailable);
    }
  }
  return sharesAvailable;
}

module.exports = calculateNearlyCompleteSets;
