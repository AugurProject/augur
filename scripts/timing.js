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
        if (rand > 0.667) {
            // scalar
            maxValue = Math.round(Math.random() * 25);
            minValue = Math.round(Math.random() * maxValue);
            numOutcomes = 2;
            type = "scalar";
        } else if (rand < 0.333) {
            // binary
            maxValue = 2;
            minValue = 1;
            numOutcomes = 2;
            type = "binary";
        } else {
            // categorical
            maxValue = 2;
            minValue = 1;
            numOutcomes = Math.floor(6*Math.random()) + 2;
            type = "categorical";
        }
        var suffix = Math.random().toString(36).substring(4);
        var description = madlibs.adjective() + "-" + madlibs.noun() + "-" + suffix;
        if (type === "categorical") {
            var choices = new Array(numOutcomes);
            for (var i = 0; i < numOutcomes; ++i) {
                choices[i] = madlibs.action();
            }
            description += "~|>" + choices.join('|');
        }
        var expDate = Math.round(new Date().getTime() / 900);
        var createSingleEventMarketParams = {
            branchId: augur.constants.DEFAULT_BRANCH_ID,
            description: description,
            expDate: expDate,
            minValue: minValue,
            maxValue: maxValue,
            numOutcomes: numOutcomes,
            resolution: madlibs.action() + "." + madlibs.noun() + "." + madlibs.tld(),
            takerFee: "0.02",
            makerFee: "0.01",
            extraInfo: madlibs.city() + " " + madlibs.verb() + " " + madlibs.adjective() + " " + madlibs.noun() + "!",
            tags: [madlibs.adjective(), madlibs.noun(), madlibs.verb()],
            onSent: function (r) {},
            onSuccess: function (r) {
                console.log("[" + type + "]", chalk.green(r.marketID), chalk.cyan.dim(description));
                augur.getMarketInfo(r.marketID, function (marketInfo) {
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
                        market: r.marketID,
                        liquidity: Math.floor(400*Math.random()) + 100,
                        startingQuantity: Math.floor(40*Math.random()) + 10,
                        bestStartingQuantity: Math.floor(40*Math.random()) + 10
                    };
                    var initialFairPrices = new Array(numOutcomes);
                    if (type === "scalar") {
                        orderBookParams.priceWidth = (0.25*(maxValue - minValue)).toString();
                        var avg = 0.5*(minValue + maxValue);
                        initialFairPrices = [0.9*avg, 1.1*avg];
                        while (initialFairPrices[0] < minValue + 0.5*parseFloat(orderBookParams.priceWidth)) {
                            initialFairPrices[0] = initialFairPrices[0]*1.01;
                            // console.log("updated left initial fair price:", initialFairPrices[0]);
                        }
                        while (initialFairPrices[1] > maxValue - 0.5*parseFloat(orderBookParams.priceWidth)) {
                            initialFairPrices[1] = initialFairPrices[1]*0.99;
                            // console.log("updated right initial fair price:", initialFairPrices[1]);
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
                    // console.log("orderBookParams:", JSON.stringify(orderBookParams, null, 2));
                    augur.generateOrderBook(orderBookParams, {
                        onBuyCompleteSets: function (res) {
                            // console.log("buyCompleteSets:", res);
                        },
                        onSetupOutcome: function (res) {
                            // console.log("setupOutcome:", res);
                        },
                        onSetupOrder: function (res) {
                            // console.log("setupOrder:", res);
                        },
                        onSuccess: function (res) {
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
