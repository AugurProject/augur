#!/usr/bin/env node
/**
 * Timing the on-contract market info collector.
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var join = require("path").join;
var _ = require("lodash");
var async = require("async");
var utils = require("../src/utilities");
var augurpath = "../src/index";
var augur = utils.setup(require(augurpath));

var DATAFILE = join(__dirname, "..", "data", "timing-getMarketsInfo.csv");
var MAX_NUM_MARKETS = 100;
try {
    MAX_NUM_MARKETS = parseInt(process.argv[2]);
} catch (ex) {
    MAX_NUM_MARKETS = 100;
}

function createMarkets(numMarketsToCreate, callback) {
    var minValue = 0;
    var maxValue = 1;
    var numOutcomes = 2;
    var period = augur.getVotePeriod(augur.branches.dev);
    var exp_date = augur.rpc.blockNumber() + 2500;
    async.eachSeries(_.range(0, numMarketsToCreate), function (index, nextIndex) {
        var description = Math.random().toString(36).substring(4);
        augur.createEvent({
            branchId: augur.branches.dev,
            description: description,
            expDate: exp_date,
            minValue: minValue,
            maxValue: maxValue,
            numOutcomes: numOutcomes,
            onSent: function (r) {
                // console.log(r);
            },
            onSuccess: function (r) {
                var alpha = "0.0079";
                var initialLiquidity = 10;
                var tradingFee = "0.02";
                var events = [ r.callReturn ];

                augur.createMarket({
                    branchId: augur.branches.dev,
                    description: description,
                    alpha: alpha,
                    initialLiquidity: initialLiquidity,
                    tradingFee: tradingFee,
                    events: events,
                    onSent: function (res) {
                        // console.log(res);
                    },
                    onSuccess: function (res) {
                        nextIndex();
                    },
                    onFailed: nextIndex
                });
            
            },
            onFailed: nextIndex
        });
    }, callback);
}

function time_getMarketsInfo(numMarkets) {
    fs.writeFileSync(DATAFILE, "\"# markets\",\"time elapsed (seconds)\"\n");
    async.eachSeries(_.range(1, numMarkets + 1), function (sample, nextSample) {
        augur = utils.setup(utils.reset(augurpath));
        var startTime = new Date().getTime();
        augur.getMarketsInfo({
            branch: augur.branches.dev,
            offset: 0,
            numMarketsToLoad: sample,
            callback: function (info) {
                if (!info || info.error) return nextSample(info);
                var dt = ((new Date().getTime() - startTime) / 1000.0).toString();
                var numMarkets = Object.keys(info).length.toString();
                console.log(numMarkets + "\t" + dt);
                fs.appendFileSync(DATAFILE, numMarkets + "," + dt + "\n");
                nextSample();
            }
        });
    }, process.exit);
}

function timing(maxNumMarkets) {
    var numMarkets = parseInt(augur.getNumMarketsBranch(augur.branches.dev));
    console.log("Found", numMarkets, "markets");

    if (numMarkets >= maxNumMarkets) {
        return time_getMarketsInfo(numMarkets);
    }
    createMarkets(maxNumMarkets - numMarkets, function (err) {
        if (err) return console.error(err);
        time_getMarketsInfo(maxNumMarkets);
    });
}

timing(MAX_NUM_MARKETS);
