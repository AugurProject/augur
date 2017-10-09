"use strict";

var BigNumber = require("bignumber.js");

var compareOrdersByPrice = {
  1: function (order1, order2) {
    return order1.fullPrecisionPrice - order2.fullPrecisionPrice;
  },
  2: function (order1, order2) {
    return order2.fullPrecisionPrice - order1.fullPrecisionPrice;
  }
};

/**
 * Bids are sorted descendingly, asks are sorted ascendingly.
 * @param {require("./simulate-trade").OrderBook} orderBook Bids or asks
 * @param {number} orderType Order type (0 for "buy", 1 for "sell").
 * @param {string} price Limit price for this order (i.e. the worst price the user will accept), as a base-10 string.
 * @param {string} userAddress The user's Ethereum address, as a hexadecimal string.
 * @return {require("./simulate-trade").OrderBook} Filtered and sorted orders.
 */
function filterByPriceAndOutcomeAndUserSortByPrice(orderBook, orderType, price, userAddress) {
  var isMarketOrder, filteredOrders;
  if (!orderBook) return [];
  isMarketOrder = price == null;
  filteredOrders = Object.keys(orderBook).map(function (orderId) {
    return orderBook[orderId];
  }).filter(function (order) {
    var isMatchingPrice;
    if (!order || !order.fullPrecisionPrice) return false;
    if (isMarketOrder) {
      isMatchingPrice = true;
    } else {
      isMatchingPrice = orderType === 0 ? new BigNumber(order.fullPrecisionPrice, 10).lte(price) : new BigNumber(order.fullPrecisionPrice, 10).gte(price);
    }
    return order.owner !== userAddress && isMatchingPrice;
  });
  return filteredOrders.sort(compareOrdersByPrice[orderType]);
}

module.exports = filterByPriceAndOutcomeAndUserSortByPrice;
