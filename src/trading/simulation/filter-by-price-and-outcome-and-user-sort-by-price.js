"use strict";

var BigNumber = require("bignumber.js");

function compareOrdersByPrice(order1, order2) {
  return traderOrderType === "buy" ? order1.price - order2.price : order2.price - order1.price;
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
  var isMarketOrder;
  if (!orders) return [];
  isMarketOrder = limitPrice == null;
  return Object.keys(orders).map(function (orderID) {
    return orders[orderID];
  }).filter(function (order) {
    var isMatchingPrice;
    if (!order || !order.price) return false;
    if (isMarketOrder) {
      isMatchingPrice = true;
    } else {
      isMatchingPrice = traderOrderType === "buy" ? new BigNumber(order.price, 10).lte(limitPrice) : new BigNumber(order.price, 10).gte(limitPrice);
    }
    return order.outcome === outcomeID && order.owner !== userAddress && isMatchingPrice;
  }).sort(compareOrdersByPrice);
}

module.exports = filterByPriceAndOutcomeAndUserSortByPrice;
