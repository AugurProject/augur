"use strict";

var ONE = require("../../constants").ONE;

/**
 * 4 * $market_fee * $price * (ONE - $price*ONE/$range) / ($range*ONE)
 * @param tradingfee BigNumber
 * @param price BigNumber
 * @param range BigNumber
 * @return BigNumber
 */
function calculateFxpAdjustedTradingFee(tradingFee, price, range) {
  return tradingFee.times(4).times(price).times(
    ONE.minus(price.times(ONE).dividedBy(range).floor())
  ).dividedBy(range.times(ONE)).floor();
}

module.exports = calculateFxpAdjustedTradingFee;
