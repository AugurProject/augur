"use strict";

var BigNumber = require("bignumber.js");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

function simulateMakeAskOrder(sharesToCover, price, range, shareBalances) {
  var gasFees = ZERO;
  // var orderValueInTokens = sharesToCover.times(range.minus(price));
  // require(orderValueInTokens >= MIN_ORDER_VALUE)
  var tokensEscrowed = ZERO;
  var sharesEscrowed = ZERO;
  var sharesToCover = sharesToCover;
  var sharesHeld = new BigNumber(shareBalances[outcomeID - 1], 10);
  if (sharesHeld.gt(PRECISION.zero)) {
    sharesEscrowed = BigNumber.min(sharesHeld, sharesToCover);
    sharesToCover = sharesToCover.minus(sharesEscrowed);
  }
  if (sharesToCover.gt(PRECISION.zero)) {
    var tokensRequiredToShortOneShare = range.minus(price);
    tokensEscrowed = sharesToCover.times(tokensRequiredToShortOneShare);
  }
  return {
    gasFees: gasFees,
    sharesDepleted: sharesEscrowed,
    tokensDepleted: tokensEscrowed
  };
}

module.exports = simulateMakeAskOrder;
