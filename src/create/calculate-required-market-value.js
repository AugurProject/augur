"use strict";

var speedomatic = require("speedomatic");
var BigNumber = require("bignumber.js");
var DEFAULT_GASPRICE = require("../constants").DEFAULT_GASPRICE;

function calculateRequiredMarketValue(gasPrice) {
  gasPrice = speedomatic.bignum(gasPrice || DEFAULT_GASPRICE);
  return speedomatic.prefixHex((new BigNumber("1200000", 10).times(gasPrice).plus(new BigNumber("500000", 10).times(gasPrice))).toString(16));
}

module.exports = calculateRequiredMarketValue;
