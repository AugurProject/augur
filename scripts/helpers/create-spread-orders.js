#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var Augur = require("../../src");
var approveAugurEternalApprovalValue = require("../dp/lib/approve-augur-eternal-approval-value");
var getPrivateKey = require("../dp/lib/get-private-key").getPrivateKey;
var connectionEndpoints = require("../connection-endpoints");
var createOrder = require("../dp/lib/create-order");

var marketId = process.argv[2];

var augur = new Augur();

function tickedPriceIncrease(priceIncrease, tickSize, numTicks) {
  return Math.abs(priceIncrease < tickSize ? tickSize : Math.ceil((priceIncrease - (priceIncrease % tickSize)) * numTicks) / numTicks);
}

function shiftToTicksize(price, tickSize, numTicks) {
  return Math.ceil((price - (price % tickSize)) * numTicks) / numTicks;
}

getPrivateKey(null, function (err, auth) {
  if (err) {
    console.error("getPrivateKey failed:", err);
    process.exit(1);
  }
  augur.connect(connectionEndpoints, function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(chalk.cyan.dim("networkId:"), chalk.cyan(augur.rpc.getNetworkID()));
    var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
    console.log(chalk.green.dim("universe:"), chalk.green(universe));
    approveAugurEternalApprovalValue(augur, auth.address, auth, function (err) {
      if (err) {
        console.error("Could not approve ...", err);
        process.exit(1);
      }
      augur.markets.getMarketsInfo({ marketIds: [marketId] }, function (err, marketsInfo) {
        if (err) {
          console.error("Could not get markets Info", err);
          process.exit(1);
        }
        if (!marketsInfo || marketsInfo.length === 0) return console.error("Market not found");
        var marketInfo = marketsInfo[0];
        if (!marketInfo) {
          console.error("Could not get markets Info", err);
          process.exit(1);
        }
        console.log(chalk.yellow.dim("Market:"), chalk.yellow(marketInfo.id));
        console.log(chalk.yellow.dim("outcomes:"), chalk.yellow(marketInfo.numOutcomes));

        // Create bids/asks on each outcome around a midpoint
        for (var outcomeI = 0; outcomeI < marketInfo.numOutcomes; outcomeI++) {
          console.log(chalk.yellow.dim("outcome:"), chalk.yellow(outcomeI));
          console.log(chalk.yellow.dim("max price:"), chalk.yellow(marketInfo.maxPrice));
          console.log(chalk.yellow.dim("min price:"), chalk.yellow(marketInfo.minPrice));

          // NOTE -- adjust these to modify the depth + # of orders in the order book.
          var sharesPerOrder = 10;
          var numberOfOrders = 50;

          // Get these to numbers
          var tickSize = parseFloat(marketInfo.tickSize, 10);
          var numTicks = parseFloat(marketInfo.numTicks, 10);

          var midPoint = (Math.random() * (marketInfo.maxPrice - marketInfo.minPrice) + marketInfo.minPrice);
          midPoint = Math.ceil((midPoint - (midPoint % tickSize)) * numTicks) / numTicks;

          // Create Bids
          var bidPriceIncrease = (midPoint - marketInfo.minPrice) / numberOfOrders;
          bidPriceIncrease = tickedPriceIncrease(bidPriceIncrease, tickSize, numTicks);

          var bidPrice = marketInfo.minPrice === 0 ? marketInfo.minPrice + bidPriceIncrease : marketInfo.minPrice;

          while (bidPrice < midPoint) {
            var bid = { price: bidPrice, shares: sharesPerOrder };
            var bidTradeGroupId = augur.trading.generateTradeGroupId();

            console.log(chalk.yellow.dim("bid:"), chalk.yellow(JSON.stringify(bid)));
            createOrder(augur, marketId, outcomeI, marketInfo.numOutcomes, marketInfo.maxPrice, marketInfo.minPrice, marketInfo.numTicks, "buy", bid, bidTradeGroupId, auth, function (err, res) {
              if (err) console.error("create-orders failed:", err);
              console.log(chalk.green.dim("Order Created"), chalk.green(JSON.stringify(res)));
            });
            bidPrice += bidPriceIncrease;
            bidPrice = shiftToTicksize(bidPrice, tickSize, numTicks);
          }

          // Create Asks
          var askPriceIncrease = (marketInfo.maxPrice - midPoint) / numberOfOrders;
          askPriceIncrease = tickedPriceIncrease(askPriceIncrease, tickSize, numTicks);

          var askPrice = midPoint + tickSize;

          while (askPrice < marketInfo.maxPrice) {
            var ask = { price: askPrice, shares: sharesPerOrder };
            var askTradeGroupId = augur.trading.generateTradeGroupId();

            console.log(chalk.yellow.dim("ask:"), chalk.yellow(JSON.stringify(ask)));
            createOrder(augur, marketId, outcomeI, marketInfo.numOutcomes, marketInfo.maxPrice, marketInfo.minPrice, marketInfo.numTicks, "sell", ask, askTradeGroupId, auth, function (err, res) {
              if (err) console.error("create-orders failed:", err);
              console.log(chalk.green.dim("Order Created"), chalk.green(JSON.stringify(res)));
            });
            askPrice += askPriceIncrease;
            askPrice = shiftToTicksize(askPrice, tickSize, numTicks);
          }
        }
      });
    });
  });
});
