/**
 * price logging/filter tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var path = require("path");
var assert = require("chai").assert;
var chalk = require("chalk");
var Augur = require("../augur");

Augur = require("./utilities").setup(Augur, process.argv.slice(2));

var log = console.log;
var TIMEOUT = 48000;

var branch = Augur.branches.dev;
var markets = Augur.getMarkets(branch);
var market_id = markets[markets.length - 1];
var outcome = "1";
var amount = "10";
var block = Augur.blockNumber();

describe("getMarketPriceHistory", function () {
    it("price history: " + market_id + " outcome " + outcome + " (async)", function (done) {
        this.timeout(TIMEOUT);
        Augur.buyShares({
            branchId: branch,
            marketId: market_id,
            outcome: outcome,
            amount: amount,
            onSent: function (r) {

            },
            onSuccess: function (r) {
                Augur.getMarketPriceHistory(market_id, outcome, function (price_logs) {
                    // log(price_logs);
                    assert.equal(price_logs.constructor, Array);
                    assert(price_logs.length);
                    assert(price_logs[0].price);
                    assert(price_logs[0].blockNumber);
                    done();
                });
            },
            onFailed: function (r) {
                throw(r.message);
            }
        });
    });
    it("price history: " + market_id + " outcome " + outcome + " (sync)", function (done) {
        this.timeout(TIMEOUT);
        Augur.buyShares({
            branchId: branch,
            marketId: market_id,
            outcome: outcome,
            amount: amount,
            onSent: function (r) {

            },
            onSuccess: function (r) {
                var price_logs = Augur.getMarketPriceHistory(market_id, outcome);
                // log(price_logs);
                assert.equal(price_logs.constructor, Array);
                assert(price_logs.length);
                assert(price_logs[0].price);
                assert(price_logs[0].blockNumber);
                done();
            },
            onFailed: function (r) {
                throw(r.message);
            }
        });
    });
});

// describe("updatePrice listener", function () {
//     it("should return data on buyShares", function (done) {
//         this.timeout(TIMEOUT);
//         Augur.start_eth_listener("updatePrice", function (filter_id) {
//             var listener = setInterval(function () {
//                 Augur.poll_eth_listener("updatePrice", function (data) {
//                     if (data) {
//                         log(data);
//                         clearInterval(listener);
//                         done();
//                     }
//                 });
//             }, 2000);
//             setTimeout(function () {
//                 Augur.buyShares({
//                     branchId: branch,
//                     marketId: market_id,
//                     outcome: outcome,
//                     amount: amount,
//                     onSent: function (r) {

//                     },
//                     onSuccess: function (r) {
//                         // log(r);
//                     },
//                     onFailed: function (r) {
//                         throw(r.message);
//                     }
//                 });
//             }, 2000);
//         });
//     });
// });
