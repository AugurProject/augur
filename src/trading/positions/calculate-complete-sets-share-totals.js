"use strict";

var abi = require("augur-abi");
var modifyPosition = require("./modify-position");
var ZERO = require("../../constants").ZERO;

/**
 * Calculates the total number of complete sets bought/sold.
 *
 * @param {Array} logs Event logs from eth_getLogs request.
 * @return {Object} Total number of complete sets keyed by market ID.
 */
function calculateCompleteSetsShareTotals(logs) {
  var i, numLogs, marketID, logData, shareTotals;
  if (!logs) return {};
  shareTotals = {};
  for (i = 0, numLogs = logs.length; i < numLogs; ++i) {
    if (logs[i] && logs[i].data && logs[i].data !== "0x") {
      marketID = logs[i].topics[2];
      if (!shareTotals[marketID]) shareTotals[marketID] = ZERO;
      logData = abi.unroll_array(logs[i].data);
      if (logData && logData.length) {
        shareTotals[marketID] = modifyPosition(logs[i].topics[3], shareTotals[marketID], logData[0]);
      }
    }
  }
  return shareTotals;
}

module.exports = calculateCompleteSetsShareTotals;
