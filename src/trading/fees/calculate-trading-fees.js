"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");

var ONE_POINT_FIVE = new BigNumber("1.5", 10);

function calculateTradingFees(makerFee, takerFee) {
  var bnMakerFee = abi.bignum(makerFee);
  var tradingFee = abi.bignum(takerFee).plus(bnMakerFee).dividedBy(ONE_POINT_FIVE);
  var makerProportionOfFee = bnMakerFee.dividedBy(tradingFee);
  return { tradingFee: tradingFee, makerProportionOfFee: makerProportionOfFee };
}

module.exports = calculateTradingFees;
