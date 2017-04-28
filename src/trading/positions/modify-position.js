"use strict";

var abi = require("augur-abi");

/**
 * @param {string} typeCode Type code (buy=1, sell=2); integer 32-byte hex.
 * @param {BigNumber} position Starting number of shares.
 * @param {string} numShares Shares to add or subtract; fixedpoint 32-byte hex.
 * @return {BigNumber} Modified number of shares.
 */
function modifyPosition(typeCode, position, numShares) {
  var unfixedNumShares = abi.unfix(numShares);
  var newPosition;
  switch (parseInt(typeCode, 16)) {
    case 1: // buy
      newPosition = position.plus(unfixedNumShares);
      break;
    default: // sell
      newPosition = position.minus(unfixedNumShares);
      break;
  }
  return newPosition;
}

module.exports = modifyPosition;
