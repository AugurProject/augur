"use strict";

var filterByPriceAndOutcomeAndUserSortByPrice = require("../simulation/filter-by-price-and-outcome-and-user-sort-by-price");

function calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address) {
  var orders = (orderBooks[marketID] && orderBooks[marketID].buy) || {};
  return filterByPriceAndOutcomeAndUserSortByPrice(orders, "sell", limitPrice, outcomeID, address).map(function (order) { return order.id; });
}

module.exports = calculateSellTradeIDs;
