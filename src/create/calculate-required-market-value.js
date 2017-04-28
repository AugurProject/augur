"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var DEFAULT_GASPRICE = require("../constants").DEFAULT_GASPRICE;

function calculateRequiredMarketValue(gasPrice) {
  gasPrice = abi.bignum(gasPrice || DEFAULT_GASPRICE);
  return abi.prefix_hex((new BigNumber("1200000", 10).times(gasPrice).plus(new BigNumber("500000", 10).times(gasPrice))).toString(16));
}

module.exports = calculateRequiredMarketValue;
