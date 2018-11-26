"use strict";

var cannedMarketsData = require("../data/canned-markets");

function selectCannedMarket(description, marketType) {
  return cannedMarketsData.find(function (cannedMarketData) {
    return cannedMarketData._description === description && cannedMarketData.marketType === marketType;
  });
}

module.exports = selectCannedMarket;
