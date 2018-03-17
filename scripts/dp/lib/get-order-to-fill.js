"use strict";

var BigNumber = require("bignumber.js");
var debugOptions = require("../../debug-options");

function getOrderToFill(augur, marketId, outcomeToTrade, orderType, fillerAddress, callback) {
  augur.trading.getOrders({ marketId: marketId, outcome: outcomeToTrade, orderType: orderType }, function (err, orderBook) {
    if (err) return callback(err);
    if (!orderBook[marketId] || !orderBook[marketId][outcomeToTrade] || !orderBook[marketId][outcomeToTrade][orderType]) {
      return callback(null);
    }
    var orders = orderBook[marketId][outcomeToTrade][orderType];
    var orderIDToFill = Object.keys(orders).find(function (orderId) {
      return orders[orderId].orderState !== "CANCELED" && orders[orderId].owner !== fillerAddress && new BigNumber(orders[orderId].fullPrecisionAmount.toString(), 10).gt(new BigNumber(0));
    });
    if (orderIDToFill == null) return callback(null);
    if (debugOptions.cannedMarkets) console.log("orderToFill:", orderType, orderIDToFill, orders[orderIDToFill]);
    callback(null, orders[orderIDToFill]);
  });
}

module.exports = getOrderToFill;
