"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");

var ONE_POINT_FIVE = new BigNumber("1.5", 10);

// expects fixed-point inputs if !isUnfixed
function calculateMakerTakerFees(tradingFee, makerProportionOfFee, isUnfixed, returnBigNumber) {
  var bnTradingFee, bnMakerProportionOfFee, makerFee;
  if (!isUnfixed) {
    bnTradingFee = abi.unfix(tradingFee);
    bnMakerProportionOfFee = abi.unfix(makerProportionOfFee);
  } else {
    bnTradingFee = abi.bignum(tradingFee);
    bnMakerProportionOfFee = abi.bignum(makerProportionOfFee);
  }
  makerFee = bnTradingFee.times(bnMakerProportionOfFee);
  if (returnBigNumber) {
    return {
      trading: bnTradingFee,
      maker: makerFee,
      taker: ONE_POINT_FIVE.times(bnTradingFee).minus(makerFee)
    };
  }
  return {
    trading: bnTradingFee.toFixed(),
    maker: makerFee.toFixed(),
    taker: ONE_POINT_FIVE.times(bnTradingFee).minus(makerFee).toFixed()
  };
}

module.exports = calculateMakerTakerFees;
