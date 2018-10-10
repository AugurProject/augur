"use strict";

var BigNumber = require("bignumber.js");

var compareOrdersByPrice = {
  0: function (order1, order2) {
    return BigNumber.isBigNumber(order1.fullPrecisionPrice) ? order1.fullPrecisionPrice.minus(order2.fullPrecisionPrice) : new BigNumber(order1.fullPrecisionPrice, 10).minus(new BigNumber(order2.fullPrecisionPrice, 10));
  },
  1: function (order1, order2) {
    return BigNumber.isBigNumber(order2.fullPrecisionPrice) ? order2.fullPrecisionPrice.minus(order1.fullPrecisionPrice) : new BigNumber(order2.fullPrecisionPrice, 10).minus(new BigNumber(order1.fullPrecisionPrice, 10));
  },
};

/** Type definition for singleOutcomeOrderBookSideOrder.
 * @typedef {Object} singleOutcomeOrderBookSideOrder
 * @property {string} amount Number of shares to trade.
 * @property {string} fullPrecisionPrice Full price in ETH at which to trade.
 * @property {string} owner Ethereum address of the order's owner, as a 20-byte hexadecimal string.
 */

/**
 * Bids are sorted descendingly, asks are sorted ascendingly.
 * @param {Object} p Parameters object.
 * @param {Array.<singleOutcomeOrderBookSideOrder>} p.singleOutcomeOrderBookSide Bid or ask orders for a particular outcome of a market.
 * @param {number} p.orderType Order type (0 for "buy", 1 for "sell").
 * @param {string} p.price Limit price for this order (i.e. the worst price the user will accept), as a base-10 string.
 * @return {Array.<singleOutcomeOrderBookSideOrder>} Array of filtered and sorted orders.
 */
function filterAndSortByPrice(p) {
  if (!p || !p.singleOutcomeOrderBookSide) return [];
  var isMarketOrder = p.price == null;
  return Object.keys(p.singleOutcomeOrderBookSide).map(function (orderId) {
    return p.singleOutcomeOrderBookSide[orderId];
  }).filter(function (order) {
    var isMatchingPrice;
    if (!order || !order.fullPrecisionPrice) return false;
    if (isMarketOrder) {
      isMatchingPrice = true;
    } else {
      if (BigNumber.isBigNumber(order.fullPrecisionPrice)) {
        isMatchingPrice = p.orderType === 0 ? order.fullPrecisionPrice.lte(p.price) : order.fullPrecisionPrice.gte(p.price);
      } else {
        isMatchingPrice = p.orderType === 0 ? new BigNumber(order.fullPrecisionPrice, 10).lte(p.price) : new BigNumber(order.fullPrecisionPrice, 10).gte(p.price);
      }
    }
    return isMatchingPrice;
  }).sort(compareOrdersByPrice[p.orderType]);
}

module.exports = filterAndSortByPrice;
