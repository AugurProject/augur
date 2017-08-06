"use strict";

var BigNumber = require("bignumber.js");

function compareBuyOrdersByPrice(order1, order2) {
  return order1.fullPrecisionPrice - order2.fullPrecisionPrice;
}

function compareSellOrdersByPrice(order1, order2) {
  return order2.fullPrecisionPrice - order1.fullPrecisionPrice;
}

/**
 * Bids are sorted descendingly, asks are sorted ascendingly
 *
 * @param {Array} orders Bids or asks
 * @param {String} traderOrderType What trader want to do (buy or sell)
 * @param {BigNumber=} limitPrice When buying it's max price to buy at, when selling it min price to sell at. If it's null order is considered to be market order
 * @param {String} outcomeID
 * @param {String} userAddress
 * @return {Array.<Object>}
 */
function filterByPriceAndOutcomeAndUserSortByPrice(orders, traderOrderType, limitPrice, outcomeID, userAddress) {
  var isMarketOrder, filteredOrders;
  if (!orders) return [];
  isMarketOrder = limitPrice == null;
  filteredOrders = Object.keys(orders).map(function (orderID) {
    return orders[orderID];
  }).filter(function (order) {
    var isMatchingPrice;
    if (!order || !order.fullPrecisionPrice) return false;
    if (isMarketOrder) {
      isMatchingPrice = true;
    } else {
      isMatchingPrice = traderOrderType === "buy" ? new BigNumber(order.fullPrecisionPrice, 10).lte(limitPrice) : new BigNumber(order.fullPrecisionPrice, 10).gte(limitPrice);
    }
    return order.outcome === outcomeID && order.owner !== userAddress && isMatchingPrice;
  });
  if (traderOrderType === "buy") return filteredOrders.sort(compareBuyOrdersByPrice);
  return filteredOrders.sort(compareSellOrdersByPrice);
}

module.exports = filterByPriceAndOutcomeAndUserSortByPrice;
