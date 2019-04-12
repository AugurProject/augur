import async from "async";
import chalk from "chalk";
import cancelOrder from "./cancel-order";


function cancelOrders(augur, creator, universe, auth, callback) {
  console.log(chalk.cyan("Canceling orders for"), chalk.green(creator), chalk.cyan("in universe"), chalk.green(universe));
  augur.trading.getOrders({
    creator: creator,
    universe: universe,
    orderState: augur.constants.ORDER_STATE.OPEN
  }, function(err, orders) {
    if (err) return callback(err);
    async.forEachOf(orders, function(ordersInMarket, marketId, nextMarket) {
      async.forEachOf(ordersInMarket, function(ordersInOutcome, outcome, nextOutcome) {
        async.forEachOf(ordersInOutcome, function(buyOrSellOrders, orderType, nextOrderType) {
          async.each(Object.keys(buyOrSellOrders), function(orderId, nextOrder) {
            if (debugOptions.cannedMarkets) console.log(chalk.green(orderId), chalk.red.bold(orderType), JSON.stringify(buyOrSellOrders[orderId], null, 2));
            cancelOrder(augur, orderId, orderType, marketId, parseInt(outcome, 10), auth, nextOrder);
          }, nextOrderType);
        }, nextOutcome);
      }, nextMarket);
    }, callback);
  });
}

export default cancelOrders;
