"use strict";

var BigNumber = require("bignumber.js");
var constants = require("../constants");

module.exports = function (numShares, position) {
  var askShares, shortAskShares;
  if (position.gt(numShares)) {
    askShares = numShares.round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
    shortAskShares = 0;
  } else {
    askShares = position.toFixed();
    shortAskShares = numShares.minus(position).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN).toFixed();
  }
  return { askShares: askShares, shortAskShares: shortAskShares };
};
