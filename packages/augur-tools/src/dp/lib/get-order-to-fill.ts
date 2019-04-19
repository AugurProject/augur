import BigNumber from "bignumber.js";

function getOrderToFill(augur, marketId, outcomeToTrade, orderType, fillerAddress, callback) {
  augur.trading.getOrders({
    marketId: marketId,
    outcome: outcomeToTrade,
    orderType: orderType
  }, function(err, orderBook) {
    if (err) return callback(err);
    if (!orderBook[marketId] || !orderBook[marketId][outcomeToTrade] || !orderBook[marketId][outcomeToTrade][orderType]) {
      return callback(null);
    }
    let orders = orderBook[marketId][outcomeToTrade][orderType];
    let orderIDToFill = Object.keys(orders).find(orderId => orders[orderId].orderState !== "CANCELED" && orders[orderId].owner !== fillerAddress && new BigNumber(orders[orderId].fullPrecisionAmount.toString(), 10).gt(new BigNumber(0)));
    if (orderIDToFill == null) return callback(null);
    callback(null, orders[orderIDToFill]);
  });
}

export default getOrderToFill;
