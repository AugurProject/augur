"use strict";

var convertDisplayPriceToAdjustedForNumTicksDisplayPrice = require("../utils/convert-display-price-to-adjusted-for-num-ticks-display-price");

function convertDisplayPricesInSingleOutcomeOrderBookSideToAdjustedForNumTicksDisplayPrices(singleOutcomeOrderBookSide, numTicks, minPrice, maxPrice) {
  Object.keys(singleOutcomeOrderBookSide).forEach(function (orderId) {
    singleOutcomeOrderBookSide[orderId].fullPrecisionPrice = convertDisplayPriceToAdjustedForNumTicksDisplayPrice({
      displayPrice: singleOutcomeOrderBookSide[orderId].fullPrecisionPrice,
      numTicks: numTicks,
      maxPrice: maxPrice,
      minPrice: minPrice,
    });
  });
  return singleOutcomeOrderBookSide;
}

module.exports = convertDisplayPricesInSingleOutcomeOrderBookSideToAdjustedForNumTicksDisplayPrices;
