"use strict";

var updateRealizedPL = require("./update-realized-pl");
var ZERO = require("../../constants").ZERO;

function sellCompleteSetsPL(PL, shares, price) {
  var updatedPL = {
    position: PL.position,
    meanOpenPrice: PL.meanOpenPrice,
    realized: PL.realized,
    completeSetsBought: PL.completeSetsBought,
    queued: PL.queued,
    tradeQueue: PL.tradeQueue,
  };

  // If position <= 0, user is closing out a short position:
  //  - update realized P/L
  if (PL.position.lte(ZERO)) {
    if (shares.gt(ZERO) && updatedPL.tradeQueue && updatedPL.tradeQueue.length) {
      while (updatedPL.tradeQueue.length) {
        if (updatedPL.tradeQueue[0].shares.gt(shares)) {
          updatedPL.realized = updateRealizedPL(updatedPL.tradeQueue[0].meanOpenPrice, updatedPL.realized, shares.negated(), updatedPL.tradeQueue[0].price);
          updatedPL.tradeQueue[0].shares = updatedPL.tradeQueue[0].shares.minus(shares);
          break;
        } else {
          updatedPL.realized = updateRealizedPL(updatedPL.tradeQueue[0].meanOpenPrice, updatedPL.realized, updatedPL.tradeQueue[0].shares.negated(), updatedPL.tradeQueue[0].price);
          updatedPL.tradeQueue.splice(0, 1);
        }
      }
    }

  // If position > 0, user is decreasing their long position:
  //  - decrease position
  } else {
    updatedPL.position = updatedPL.position.minus(shares);
    updatedPL.realized = updateRealizedPL(PL.meanOpenPrice, PL.realized, shares, price);
  }

  return updatedPL;
}

module.exports = sellCompleteSetsPL;
