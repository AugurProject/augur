"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");

var ONE = new BigNumber("1", 10);

/**
 * Calculates the effective price of each complete set (1/numOutcomes).
 *
 * @param {Array} logs Event logs from eth_getLogs request.
 * @return {Object} Effective price keyed by market ID.
 */
function calculateShortSellBuyCompleteSetsEffectivePrice(logs) {
  var i, numLogs, marketID, logData, effectivePrice;
  if (!logs) return {};
  effectivePrice = {};
  for (i = 0, numLogs = logs.length; i < numLogs; ++i) {
    if (logs[i] && logs[i].data && logs[i].data !== "0x") {
      marketID = logs[i].topics[1];
      if (!effectivePrice[marketID]) {
        logData = abi.unroll_array(logs[i].data);
        if (logData && logData.length && logData.length === 8) {
          effectivePrice[marketID] = ONE.dividedBy(abi.bignum(logData[7]));
        }
      }
    }
  }
  return effectivePrice;
}

module.exports = calculateShortSellBuyCompleteSetsEffectivePrice;
