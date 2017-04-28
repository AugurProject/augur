"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var ONE = require("../../constants").ONE;

var ONE_POINT_FIVE = new BigNumber("1.5", 10);

function calculateFxpMakerTakerFees(tradingFee, makerProportionOfFee) {
  var fxpTradingFee, fxpMakerProportionOfFee, makerFee, takerFee;
  fxpTradingFee = abi.bignum(tradingFee);
  fxpMakerProportionOfFee = abi.bignum(makerProportionOfFee);
  makerFee = fxpTradingFee.times(fxpMakerProportionOfFee).dividedBy(ONE).floor();
  takerFee = ONE_POINT_FIVE.times(fxpTradingFee).dividedBy(ONE).floor().minus(makerFee);
  return {
    trading: fxpTradingFee,
    maker: makerFee,
    taker: takerFee
  };
}

module.exports = calculateFxpMakerTakerFees;
