import async from "async";
import chalk from "chalk";
import createOrder from "./create-order";
import { OrderBook } from "../data/yes-no-order-book";

export function createOrderBook(augur, marketId, numOutcomes:number, maxPrice:string, minPrice:string, numTicks:string, orderBook:OrderBook, auth, callback) {
  async.forEachOfLimit(orderBook, augur.constants.PARALLEL_LIMIT, function(orders, orderType, nextOrderType) {
    let tradeGroupId = augur.trading.generateTradeGroupId();
    console.log(chalk.cyan.dim("Creating"), chalk.cyan(orderType), chalk.cyan.dim("orders - trade group ID"), chalk.green(tradeGroupId));
    async.forEachOfLimit(orders, augur.constants.PARALLEL_LIMIT, function(outcomeOrders, outcome, nextOutcome) {
      console.log(chalk.cyan.dim("Creating orders for outcome"), chalk.cyan(outcome));
      async.eachLimit(outcomeOrders, augur.constants.PARALLEL_LIMIT, function(order, nextOrder) {
        createOrder(augur, marketId, parseInt(outcome, 10), numOutcomes, maxPrice, minPrice, numTicks, orderType, order, tradeGroupId, auth, nextOrder);
      }, nextOutcome);
    }, nextOrderType);
  }, callback);
}
