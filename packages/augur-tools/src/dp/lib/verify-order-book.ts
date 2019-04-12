import BigNumber from "bignumber.js";
import chalk from "chalk";


function verifyOrderBook(augur, marketId, orderState, minimumExpectedOrderBook, callback) {
  if (debugOptions.cannedMarkets) {
    console.log(chalk.cyan("Verifying"), chalk.red.bold(orderState), chalk.cyan("orders for market"), chalk.green(marketId));
  }
  augur.trading.getOrders({ marketId: marketId, orderState: orderState }, function(err, orders) {
    if (err) return callback(err);
    if (!orders) return callback(new Error("Orderbook not found for market " + marketId));
    if (debugOptions.cannedMarkets) {
      console.log(chalk.cyan.dim("Minimum expected order book:"), chalk.white.dim(JSON.stringify(minimumExpectedOrderBook, null, 2)));
      console.log(chalk.cyan.dim("Actual order book:"), chalk.white.dim(JSON.stringify(orders[marketId], null, 2)));
    }
    let isAllExpectedNumShares = true;
    Object.keys(orders[marketId]).forEach(function(outcome) {
      let ordersInOutcome = orders[marketId][outcome];
      Object.keys(ordersInOutcome).forEach(function(orderType) {
        let buyOrSellOrders = ordersInOutcome[orderType];
        if (debugOptions.cannedMarkets) console.log("Verify", chalk.red.bold(orderType), "outcome", chalk.green(outcome));
        let minimumExpectedOrders = ((minimumExpectedOrderBook || {})[orderType] || {})[outcome];
        if (!minimumExpectedOrders) {
          return console.warn("Expected " + orderType + " orders not found for market " + marketId + " outcome " + outcome);
        }
        minimumExpectedOrders.forEach(function(expectedOrder) {
          let expectedPrice = new BigNumber(expectedOrder.price, 10);
          let expectedNumShares = new BigNumber(expectedOrder.shares, 10);
          let actualOrderIdsAtExpectedPrice = Object.keys(buyOrSellOrders).filter(function(orderId) {
            console.log("actual order:", orderId, buyOrSellOrders[orderId].fullPrecisionPrice, buyOrSellOrders[orderId].fullPrecisionAmount);
            return new BigNumber(buyOrSellOrders[orderId].fullPrecisionPrice, 10).eq(expectedPrice);
          });
          let isExpectedNumShares = false;
          actualOrderIdsAtExpectedPrice.forEach(function(actualOrderIdAtExpectedPrice) {
            if (new BigNumber(buyOrSellOrders[actualOrderIdAtExpectedPrice].fullPrecisionAmount, 10).eq(expectedNumShares)) {
              isExpectedNumShares = true;
              console.log("VERIFIED");
            }
          });
          if (!isExpectedNumShares) {
            isAllExpectedNumShares = false;
            console.error("Couldn't find expected order: " + orderType + " " + expectedOrder.shares + " shares @ " + expectedOrder.price + " ETH for market " + marketId + " outcome " + outcome);
          }
        });
      });
    });
    if (!isAllExpectedNumShares) return callback(new Error("Orderbook verification failed for market " + marketId));
    callback(null);
  });
}

export default verifyOrderBook;
