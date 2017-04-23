"use strict";

var BigNumber = require("bignumber.js");

function getMinMax(marketInfo) {
  if (marketInfo.type === "scalar") {
    return {
      minValue: new BigNumber(marketInfo.minValue, 10),
      maxValue: new BigNumber(marketInfo.maxValue, 10)
    };
  }
  return {
    minValue: new BigNumber(0),
    maxValue: new BigNumber(1, 10)
  };
}

module.exports = getMinMax;
