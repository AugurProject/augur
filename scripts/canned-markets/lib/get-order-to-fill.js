"use strict";

var debugOptions = require("../../debug-options");

function getOrderToFill(augur, marketID, outcomeToTrade, orderType, fillerAddress, callback) {
  augur.trading.getOrders({ marketID: marketID, outcome: outcomeToTrade, orderType: orderType }, function (err, orderBook) {
    if (err) return callback(err);
    if (!orderBook[marketID] || !orderBook[marketID][outcomeToTrade] || !orderBook[marketID][outcomeToTrade][orderType]) {
      return callback(null);
    }
    var orders = orderBook[marketID][outcomeToTrade][orderType];
    var orderIDToFill = Object.keys(orders).find(function (orderID) {
      return orders[orderID].orderState !== "CANCELED" && orders[orderID].owner !== fillerAddress;
    });
    if (orderIDToFill == null) return callback(null);
    if (debugOptions.cannedMarkets) console.log("orderToFill:", orderType, orderIDToFill, orders[orderIDToFill]);
    callback(null, orders[orderIDToFill]);
  });
}

module.exports = getOrderToFill;
