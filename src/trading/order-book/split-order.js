"use strict";

var ROUND_DOWN = require("bignumber.js").ROUND_DOWN;
var PRECISION = require("../../constants").PRECISION;

function splitOrder(numShares, position) {
  var askShares, shortAskShares;
  if (position.gt(numShares)) {
    askShares = numShares.round(PRECISION.decimals, ROUND_DOWN);
    shortAskShares = 0;
  } else {
    askShares = position.toFixed();
    shortAskShares = numShares.minus(position).round(PRECISION.decimals, ROUND_DOWN).toFixed();
  }
  return { askShares: askShares, shortAskShares: shortAskShares };
}

module.exports = splitOrder;
