"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");

function shrinkScalarPrice(minValue, price) {
  if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
  if (price.constructor !== BigNumber) price = abi.bignum(price);
  return price.minus(minValue).toFixed();
}

module.exports = shrinkScalarPrice;
