"use strict";

var filterByPriceAndOutcomeAndUserSortByPrice = require("./simulation/filter-by-price-and-outcome-and-user-sort-by-price");

function calculateBuyTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address) {
  var orders = (orderBooks[marketID] && orderBooks[marketID].sell) || {};
  return filterByPriceAndOutcomeAndUserSortByPrice(orders, "buy", limitPrice, outcomeID, address).map(function (order) { return order.id; });
}

module.exports = calculateBuyTradeIDs;
