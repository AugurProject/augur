#!/usr/bin/env node
/**
 * Timing the on-contract market info collector.
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var join = require("path").join;
var async = require("async");
var chalk = require("chalk");
var madlibs = require("madlibs");
var utils = require("../src/utilities");
var augurpath = "../src/index";
var tools = require("../test/tools");
process.env.AUGURJS_INTEGRATION_TESTS = true;
var augur = tools.setup(require(augurpath));

var DEBUG = false;

var DATAFILE = join(__dirname, "..", "data", "timing-getMarketsInfo.csv");
var MAX_NUM_MARKETS = 100;
try {
  MAX_NUM_MARKETS = parseInt(process.argv[2]);
} catch (ex) {
  MAX_NUM_MARKETS = 100;
}

function createMarkets(numMarketsToCreate, callback) {
  console.log(chalk.blue.bold("Creating " + numMarketsToCreate + " markets..."));
  async.forEachOfSeries(new Array(numMarketsToCreate), function (_, index, next) {
    var minValue, maxValue, numOutcomes, type;
    var rand = Math.random();
    var prefix;
    if (rand > 0.667) {
      // scalar
      maxValue = Math.round(Math.random() * 25);
      minValue = Math.round(Math.random() * maxValue);
      numOutcomes = 2;
      prefix = "How much";
      type = "scalar";
    } else if (rand < 0.333) {
      // binary
      maxValue = 2;
      minValue = 1;
      numOutcomes = 2;
      prefix = "Will";
      type = "binary";
    } else {
      // categorical
      maxValue = 2;
      minValue = 1;
      numOutcomes = Math.floor(6*Math.random()) + 3;
      prefix = "Which";
      type = "categorical";
    }
    var streetName = madlibs.streetName();
    var action = madlibs.action();
    var city = madlibs.city();
    var description = prefix + " " + city + " " + madlibs.noun() + " " + action + " " + streetName + " " + madlibs.noun() + "?";
    var resolution = "http://" + action + "." + madlibs.noun() + "." + madlibs.tld();
    var tags = [streetName, madlibs.noun(), city];
    var extraInfo = streetName + " is a " + madlibs.adjective() + " " + madlibs.noun() + ".  " + madlibs.transportation() + " " + madlibs.usState() + " " + action + " and " + madlibs.noun() + "!";
    if (type === "categorical") {
      var choices = new Array(numOutcomes);
      for (var i = 0; i < numOutcomes; ++i) {
        choices[i] = madlibs.action();
      }
      description += "~|>" + choices.join('|');
    }
    var expDate = Math.round(new Date().getTime() / 995);
    var createSingleEventMarketParams = {
      branchId: augur.constants.DEFAULT_BRANCH_ID,
      description: description,
      expDate: expDate,
      minValue: minValue,
      maxValue: maxValue,
      numOutcomes: numOutcomes,
      resolution: resolution,
      takerFee: "0.02",
      makerFee: "0.01",
      extraInfo: extraInfo,
      tags: tags,
      onSent: function (r) {},
      onSuccess: function (r) {
        var marketID = r.callReturn;
        if (!marketID) return next();
        console.log("[" + type + "]", chalk.green(marketID), chalk.cyan.dim(description));
        augur.getMarketInfo(marketID, function (marketInfo) {
          if (marketInfo === null) {
            console.log(chalk.red("Market info not found:"), chalk.cyan.dim(description), chalk.white.dim(expDate));
            return augur.setCash(augur.from, "10000000000000",
              function (r) {},
              function (r) { next(); },
              function (err) {
                console.error(chalk.red.bold("setCash failed:"), err);
                next();
              }
            );
          }
          var orderBookParams = {
            market: marketID,
            liquidity: Math.floor(400*Math.random()) + 10000,
            startingQuantity: Math.floor(40*Math.random()) + 1000,
            bestStartingQuantity: Math.floor(40*Math.random()) + 1000
          };
          var initialFairPrices = new Array(numOutcomes);
          if (type === "scalar") {
            orderBookParams.priceWidth = (0.25*(maxValue - minValue)).toString();
            var avg = 0.5*(minValue + maxValue);
            initialFairPrices = [0.5*avg, 1.5*avg];
            while (initialFairPrices[0] < minValue + 0.5*parseFloat(orderBookParams.priceWidth)) {
              initialFairPrices[0] = initialFairPrices[0]*1.01;
            }
            while (initialFairPrices[1] > maxValue - 0.5*parseFloat(orderBookParams.priceWidth)) {
              initialFairPrices[1] = initialFairPrices[1]*0.99;
            }
          } else {
            orderBookParams.priceWidth = Math.random().toString();
            for (var i = 0; i < numOutcomes; ++i) {
              do {
                initialFairPrices[i] = ((0.4*Math.random()) + 0.3);
              } while (initialFairPrices[i] < 0.5*parseFloat(orderBookParams.priceWidth) || initialFairPrices[i] > 1 - 0.5*parseFloat(orderBookParams.priceWidth));
            }
          }
          orderBookParams.initialFairPrices = initialFairPrices;
          augur.generateOrderBook(orderBookParams, {
            onSimulate: function (sim) {
              if (DEBUG) console.log("simulation:", sim);
            },
            onBuyCompleteSets: function (res) {
              if (DEBUG) console.log("buyCompleteSets:", res);
            },
            onSetupOutcome: function (res) {
              if (DEBUG) console.log("setupOutcome:", res);
            },
            onSetupOrder: function (res) {
              if (DEBUG) console.log("setupOrder:", res);
            },
            onSuccess: function (res) {
              if (DEBUG) console.log("generateOrderBook success:", res);
              if (index % 10) return next();
              augur.setCash(augur.from, "10000000000000",
                function (r) {},
                function (r) { next(); },
                function (err) {
                  console.error(chalk.red.bold("setCash failed:"), err);
                  next();
                }
              );
            },
            onFailed: function (err) {
              console.error(chalk.red.bold("generateOrderBook failed:"), err);
              augur.setCash(augur.from, "10000000000000",
                function (r) {},
                function (r) { next(); },
                function (err) {
                  console.error(chalk.red.bold("setCash failed:"), err);
                  next();
                }
              );
            }
          });
        });
      },
      onFailed: function (err) {
        console.error(chalk.red.bold("createSingleEventMarket failed:"), err);
        augur.setCash(augur.from, "10000000000000",
          function (r) {},
          function (r) { next(); },
          function (err) {
            console.error(chalk.red.bold("setCash failed:"), err);
            next();
          }
        );
      }
    };
    augur.createSingleEventMarket(createSingleEventMarketParams);
  }, callback);
}

function time_getMarketsInfo(numMarkets) {
  fs.writeFileSync(DATAFILE, "\"# markets\",\"time elapsed (seconds)\"\n");
  async.forEachOfSeries(new Array(numMarkets), function (_, index, next) {
    augur = tools.setup(tools.reset(augurpath));
    var startTime = new Date().getTime();
    augur.getMarketsInfo({
      branch: augur.constants.DEFAULT_BRANCH_ID,
      offset: 0,
      numMarketsToLoad: index + 1,
      callback: function (info) {
        if (!info || info.error) return next(info);
        var dt = ((new Date().getTime() - startTime) / 1000.0).toString();
        var numMarkets = Object.keys(info).length.toString();
        console.log(numMarkets + "\t" + dt);
        fs.appendFileSync(DATAFILE, numMarkets + "," + dt + "\n");
        next();
      }
    });
  }, process.exit);
}

function timing(maxNumMarkets) {
  var numMarkets = parseInt(augur.getNumMarketsBranch(augur.constants.DEFAULT_BRANCH_ID));
  console.log("Found", numMarkets, "markets");
  if (numMarkets >= maxNumMarkets) {
    return time_getMarketsInfo(numMarkets);
  }
  createMarkets(maxNumMarkets - numMarkets, function (err) {
    if (err) return console.error(err);
        // time_getMarketsInfo(maxNumMarkets);
  });
}

timing(MAX_NUM_MARKETS);
