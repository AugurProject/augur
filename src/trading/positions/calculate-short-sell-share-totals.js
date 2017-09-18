"use strict";

var speedomatic = require("speedomatic");
var BigNumber = require("bignumber.js");
var ZERO = require("../../constants").ZERO;

/**
 * Calculates the largest number of shares short sold in any outcome per market.
 *
 * @param {Array} logs Event logs from eth_getLogs request.
 * @return Object Largest total number of shares sold keyed by market ID.
 */
function calculateShortSellShareTotals(logs) {
  var i, numLogs, marketID, logData, shareTotals, sharesOutcomes, outcomeID;
  if (!logs) return {};
  shareTotals = {};
  sharesOutcomes = {};
  for (i = 0, numLogs = logs.length; i < numLogs; ++i) {
    if (logs[i] && logs[i].data && logs[i].data !== "0x") {
      marketID = logs[i].topics[1];
      logData = speedomatic.unrollArray(logs[i].data);
      if (!sharesOutcomes[marketID]) sharesOutcomes[marketID] = {};
      outcomeID = parseInt(logData[3], 16).toString();
      if (!sharesOutcomes[marketID][outcomeID]) sharesOutcomes[marketID][outcomeID] = ZERO;
      sharesOutcomes[marketID][outcomeID] = sharesOutcomes[marketID][outcomeID].plus(speedomatic.unfix(logData[1]));
      shareTotals[marketID] = BigNumber.max(sharesOutcomes[marketID][outcomeID], shareTotals[marketID] || ZERO);
    }
  }
  return shareTotals;
}

module.exports = calculateShortSellShareTotals;
