"use strict";

var BigNumber = require("bignumber.js");

var ONE = new BigNumber("1", 10);

/**
 * 4 * fee * price * (1 - price/range)/range keeps fees lower at the edges
 * @param tradingfee BigNumber
 * @param price BigNumber
 * @param range BigNumber
 * @return BigNumber
 */
function calculateAdjustedTradingFee(tradingFee, price, range) {
  return tradingFee.times(4).times(price).times(ONE.minus(price.dividedBy(range))).dividedBy(range);
}

module.exports = calculateAdjustedTradingFee;
