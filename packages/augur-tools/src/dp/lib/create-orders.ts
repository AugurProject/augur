import async from "async";
import chalk from "chalk";
import createOrderBook from "./create-order-book";
import selectCannedMarket from "./select-canned-market";
import debugOptions from "../../debug-options";

function createOrders(augur, marketIds, auth, callback) {
  augur.markets.getMarketsInfo({ marketIds: marketIds }, function(err, marketsInfo) {
    if (err) return callback(err);
    async.eachSeries(marketsInfo, function(marketInfo, nextMarket) {
      if (debugOptions.cannedMarkets) console.log(chalk.cyan("Creating orders for market"), chalk.green(marketInfo.id), chalk.cyan.dim(marketInfo.description));
      if (!marketInfo || !marketInfo.id) {
        console.warn(chalk.yellow.bold("marketInfo not found:"), marketInfo);
        return nextMarket();
      }
      let cannedMarket = selectCannedMarket(marketInfo.description, marketInfo.marketType);
      if (!cannedMarket || !cannedMarket.orderBook) {
        console.warn(chalk.yellow.bold("Canned market data not found for market"), chalk.green(marketInfo.id), chalk.cyan.dim(marketInfo.description));
        return nextMarket();
      }
      createOrderBook(augur, marketInfo.id, marketInfo.numOutcomes, marketInfo.maxPrice, marketInfo.minPrice, marketInfo.numTicks, cannedMarket.orderBook, auth, nextMarket);
    }, callback);
  });
}

export default createOrders;
