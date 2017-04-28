"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var ONE = require("../../constants").ONE;

var FXP_ONE_POINT_FIVE = abi.fix(new BigNumber("1.5", 10));

function calculateFxpTradingFees(makerFee, takerFee) {
  var fxpMakerFee = abi.fix(makerFee);
  var tradingFee = abi.fix(takerFee).plus(fxpMakerFee).dividedBy(FXP_ONE_POINT_FIVE).times(ONE).floor();
  var makerProportionOfFee = fxpMakerFee.dividedBy(tradingFee).times(ONE).floor();
  return { tradingFee: tradingFee, makerProportionOfFee: makerProportionOfFee };
}

module.exports = calculateFxpTradingFees;
