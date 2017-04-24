"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var calculateFxpAdjustedTradingFee = require("./calculate-fxp-adjusted-trading-fee");
var constants = require("../../constants");
var ONE = constants.ONE;
var ZERO = constants.ZERO;

var FXP_ONE_POINT_FIVE = abi.fix(new BigNumber("1.5", 10));

// Calculates adjusted total trade cost at a specified price using fixed-point arithmetic
// @return {BigNumbers}
function calculateFxpTradingCost(amount, price, tradingFee, makerProportionOfFee, range) {
  var fxpAmount = abi.fix(amount);
  var fxpPrice = abi.fix(price);
  var adjustedTradingFee = calculateFxpAdjustedTradingFee(abi.bignum(tradingFee), fxpPrice, abi.fix(range));
  var takerFee = FXP_ONE_POINT_FIVE.minus(abi.bignum(makerProportionOfFee));
  var fee = takerFee.times(adjustedTradingFee.times(fxpAmount).dividedBy(ONE).floor().times(fxpPrice).dividedBy(ONE).floor()).dividedBy(ONE).floor();
  var noFeeCost = fxpAmount.times(fxpPrice).dividedBy(ONE).floor();
  return {
    fee: abi.unfix(fee),
    percentFee: (noFeeCost.gt(ZERO)) ?
      abi.unfix(fee.dividedBy(noFeeCost).times(ONE).abs()) :
      ZERO,
    cost: abi.unfix(noFeeCost.plus(fee)),
    cash: abi.unfix(noFeeCost.minus(fee))
  };
}

module.exports = calculateFxpTradingCost;
