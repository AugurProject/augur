"use strict";

var updateMeanOpenPrice = require("./update-mean-open-price");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

// weighted price = (old total shares / new total shares) * weighted price + (shares traded / new total shares) * trade price
// realized P/L = shares sold * (price on cash out - price on buy in)
function longerPositionPL(PL, shares, price) {
  var updatedPL = {
    position: PL.position.plus(shares),
    meanOpenPrice: PL.meanOpenPrice,
    realized: PL.realized,
    completeSetsBought: PL.completeSetsBought,
    queued: PL.queued,
    tradeQueue: PL.tradeQueue,
  };

  // If position >= 0, user is increasing a long position:
  //  - update weighted price of open positions
  if (PL.position.abs().lte(PRECISION.zero)) {
    updatedPL.meanOpenPrice = price;
  } else if (PL.position.gt(PRECISION.zero)) {
    updatedPL.meanOpenPrice = updateMeanOpenPrice(PL.position, PL.meanOpenPrice, shares, price);

  // If position < 0, user is decreasing a short position:
  } else {
    if (!updatedPL.tradeQueue) updatedPL.tradeQueue = [];

    // If |position| >= shares, user is buying back a short position:
    //  - update queued P/L (becomes realized P/L when complete sets sold)
    if (PL.position.abs().gte(shares)) {
      updatedPL.tradeQueue.push({
        meanOpenPrice: PL.meanOpenPrice,
        realized: PL.realized,
        shares: shares,
        price: price,
      });

    // If |position| < shares, user is buying back short then going long:
    //  - update queued P/L for the short position (buy to 0)
    //  - update mean open price for the remainder of shares
    } else {
      updatedPL.tradeQueue.push({
        meanOpenPrice: PL.meanOpenPrice,
        realized: PL.realized,
        shares: PL.position.abs(),
        price: price,
      });
      updatedPL.meanOpenPrice = updateMeanOpenPrice(ZERO, PL.meanOpenPrice, PL.position.plus(shares), price);
    }
  }

  return updatedPL;
}

module.exports = longerPositionPL;
