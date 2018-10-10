"use strict";

function updateRealizedPL(meanOpenPrice, realized, shares, price) {
  return realized.plus(shares.times(price.minus(meanOpenPrice)));
}

module.exports = updateRealizedPL;
