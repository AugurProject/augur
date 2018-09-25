"use strict";

var updateMeanOpenPrice = require("./update-mean-open-price");
var updateRealizedPL = require("./update-realized-pl");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

function shorterPositionPL(PL, shares, price) {
  var updatedPL = {
    position: PL.position.minus(shares),
    meanOpenPrice: PL.meanOpenPrice,
    realized: PL.realized,
    completeSetsBought: PL.completeSetsBought,
    queued: PL.queued,
    tradeQueue: PL.tradeQueue,
  };

  // If position < 0, user is increasing a short position:
  //  - treat as a "negative buy" for P/L
  //  - update weighted price of open positions
  if (PL.position.abs().lte(PRECISION.zero)) {
    updatedPL.meanOpenPrice = price;
  } else if (PL.position.lt(PRECISION.zero)) {
    updatedPL.meanOpenPrice = updateMeanOpenPrice(PL.position, PL.meanOpenPrice, shares.negated(), price);

  // If position > 0, user is decreasing a long position
  } else {

    // If position >= shares, user is doing a regular sale:
    //  - update realized P/L
    if (PL.position.gte(shares)) {
      updatedPL.realized = updateRealizedPL(PL.meanOpenPrice, PL.realized, shares, price);

    // If position < shares, user is selling then short selling:
    //  - update realized P/L for the current position (sell to 0)
    //  - update mean open price for the remainder of shares (short sell)
    } else {
      updatedPL.realized = updateRealizedPL(PL.meanOpenPrice, PL.realized, PL.position, price);
      updatedPL.meanOpenPrice = updateMeanOpenPrice(ZERO, PL.meanOpenPrice, PL.position.minus(shares), price);
    }
  }

  return updatedPL;
}

module.exports = shorterPositionPL;
