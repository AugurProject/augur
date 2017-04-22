"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");

function adjustScalarSellPrice(maxValue, price) {
  if (maxValue.constructor !== BigNumber) maxValue = abi.bignum(maxValue);
  if (price.constructor !== BigNumber) price = abi.bignum(price);
  return maxValue.minus(price).toFixed();
}

module.exports = adjustScalarSellPrice;
