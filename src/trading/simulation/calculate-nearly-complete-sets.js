"use strict";

var BigNumber = require("bignumber.js");

function calculateNearlyCompleteSets(outcomeID, desiredShares, shareBalances) {
  var sharesAvailable = desiredShares;
  for (var i = 0; i < shareBalances.length; ++i) {
    if (i !== outcomeID) {
      sharesAvailable = BigNumber.min(shareBalances[i], sharesAvailable);
    }
  }
  return sharesAvailable;
}

module.exports = calculateNearlyCompleteSets;
