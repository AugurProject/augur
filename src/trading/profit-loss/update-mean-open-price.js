"use strict";

function updateMeanOpenPrice(position, meanOpenPrice, shares, price) {
  return position.dividedBy(shares.plus(position))
    .times(meanOpenPrice)
    .plus(shares.dividedBy(shares.plus(position)).times(price));
}

module.exports = updateMeanOpenPrice;
