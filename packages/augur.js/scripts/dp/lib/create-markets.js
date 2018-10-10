"use strict";

var async = require("async");
var BigNumber = require("bignumber.js");
var chalk = require("chalk");
var approveAugurEternalApprovalValue = require("./approve-augur-eternal-approval-value");
var createMarket = require("./create-market");
var createOrderBook = require("./create-order-book");
var getBalances = require("./get-balances");
var cannedMarketsData = require("../data/canned-markets");
var debugOptions = require("../../debug-options");

function createMarkets(augur, auth, callback) {
  var networkId = augur.rpc.getNetworkID();
  var universe = augur.contracts.addresses[networkId].Universe;
  if (debugOptions.cannedMarkets) {
    console.log(chalk.cyan("Network"), chalk.green(networkId));
    console.log(chalk.cyan("Account"), chalk.green(auth.address));
  }
  getBalances(augur, universe, auth.address, function (err, balances) {
    if (err) return console.error("getBalances failed:", err);
    if (debugOptions.cannedMarkets) {
      console.log(chalk.cyan("Balances:"));
      console.log("Ether:      " + chalk.green(balances.ether));
      console.log("Reputation: " + chalk.green(balances.reputation));
    }
    approveAugurEternalApprovalValue(augur, auth.address, auth, function (err) {
      if (err) return console.error("approveAugurEternalApprovalValue failed:", err);
      console.log(chalk.cyan("Creating canned markets..."));
      async.eachLimit(cannedMarketsData, augur.constants.PARALLEL_LIMIT, function (market, nextMarket) {
        createMarket(augur, market, auth.address, auth, function (err, marketId) {
          if (err) return nextMarket(err);
          console.log(chalk.green(marketId), chalk.cyan.dim(market._description));
          if (process.env.NO_CREATE_ORDERS) return nextMarket();
          var numOutcomes = Array.isArray(market._outcomes) ? market._outcomes.length : 2;
          var numTicks;
          if (market.marketType === "scalar") {
            numTicks = new BigNumber(market._maxPrice, 10).minus(new BigNumber(market._minPrice, 10)).dividedBy(new BigNumber(market.tickSize, 10)).toNumber();
          } else {
            numTicks = augur.constants.DEFAULT_NUM_TICKS[numOutcomes];
          }
          createOrderBook(augur, marketId, numOutcomes, market._maxPrice || "1", market._minPrice || "0", numTicks, market.orderBook, auth, nextMarket);
        });
      }, callback);
    });
  });
}

module.exports = createMarkets;
