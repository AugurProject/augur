"use strict";

/**
 * @typedef BetterWorseOrders
 * @property {string|null} betterOrderId ID of the order with the next best price over the specified order ID, as a hexadecimal string.
 * @property {string|null} worseOrderId ID of the order with the next worse price over the specified order ID, as a hexadecimal string.
 */

var augurNode = require("../augur-node");

/**
 * Returns the IDs of the orders for a given outcome that have a better and worse price than the specified price. If no better/worse orders exist, null will be returned. This function should be called prior to calling augur.api.CreateOrder.publicCreateOrder in order to get the _betterOrderId and _worseOrderId parameters that it accepts. (_betterOrderId and _worseOrderId are used to optimize the sorting of Orders on the Order Book.) Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string} p.marketId Contract address of the market for which to retrieve the better/worse orders, as a hexadecimal string.
 * @param {string} p.outcome Market outcome for which to find better/worse orders.
 * @param {string} p.orderType Desired type of order. Valid values are "buy" and "sell".
 * @param {number} p.price Price point at which to find better/worse orders.
 * @param {function} callback Called when better/worse orders have been retrieved.
 * @return {BetterWorseOrders} Object containing the better/worse order IDs, as hexidecimal strings.
 */
function getBetterWorseOrders(p, callback) {
  augurNode.submitRequest("getBetterWorseOrders", p, callback);
}

module.exports = getBetterWorseOrders;
