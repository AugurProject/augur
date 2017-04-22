"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var calculateAdjustedTradingFee = require("./calculate-adjusted-trading-fee");
var ZERO = require("../../constants").ZERO;

var ONE_POINT_FIVE = new BigNumber("1.5", 10);

// Calculates adjusted total trade cost at a specified price
// @return {BigNumbers}
function calculateTradingCost(amount, price, tradingFee, makerProportionOfFee, range) {
  var bnAmount = abi.bignum(amount);
  var bnPrice = abi.bignum(price);
  var adjustedTradingFee = calculateAdjustedTradingFee(abi.bignum(tradingFee), bnPrice, abi.bignum(range));
  var takerFee = ONE_POINT_FIVE.minus(abi.bignum(makerProportionOfFee));
  var fee = takerFee.times(adjustedTradingFee.times(bnAmount).times(bnPrice));
  var noFeeCost = bnAmount.times(bnPrice);
  return {
    fee: fee,
    percentFee: (noFeeCost.gt(ZERO)) ? fee.dividedBy(noFeeCost).abs() : ZERO,
    cost: noFeeCost.plus(fee),
    cash: noFeeCost.minus(fee)
  };
}

module.exports = calculateTradingCost;
