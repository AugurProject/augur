"use strict";

var BigNumber = require("bignumber.js");

function calculateNumTicks(tickSize, minPrice, maxPrice) {
  return new BigNumber(maxPrice, 10).minus(new BigNumber(minPrice, 10)).dividedBy(new BigNumber(tickSize, 10)).toFixed();
}

module.exports = calculateNumTicks;
