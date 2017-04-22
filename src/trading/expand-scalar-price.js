"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");

function expandScalarPrice(minValue, price) {
  if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
  if (price.constructor !== BigNumber) price = abi.bignum(price);
  return price.plus(minValue).toFixed();
}

module.exports = expandScalarPrice;
