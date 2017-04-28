"use strict";

var BigNumber = require("bignumber.js");

/**
 * @param {Object} position Starting position in a market {outcomeID: String{decimal}}.
 * @param {BigNumber} adjustment Amount to decrease all positions by.
 * @return {Object} Decreased market position {outcomeID: String{decimal}}.
 */
function decreasePosition(position, adjustment) {
  var newPosition, outcomeIDs, i, numOutcomeIDs;
  newPosition = {};
  outcomeIDs = Object.keys(position || {});
  for (i = 0, numOutcomeIDs = outcomeIDs.length; i < numOutcomeIDs; ++i) {
    newPosition[outcomeIDs[i]] = new BigNumber(position[outcomeIDs[i]], 10).minus(adjustment).toFixed();
  }
  return newPosition;
}

module.exports = decreasePosition;
