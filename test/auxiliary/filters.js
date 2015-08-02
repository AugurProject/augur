/**
 * price logging/filter tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var chalk = require("chalk");
var constants = require("../../src/constants");
var utilities = require("../../src/utilities");
var Augur = utilities.setup(require("../../src"), process.argv.slice(2));
var log = console.log;

var branch = Augur.branches.dev;
var markets = Augur.getMarkets(branch);
var market_id = markets[markets.length - 1];
var outcome = "1";
var amount = "10";

describe("getMarketPriceHistory", function () {
    it("price history (async)", function (done) {
        this.timeout(constants.TIMEOUT);
        Augur.buyShares({
            branchId: branch,
            marketId: market_id,
            outcome: outcome,
            amount: amount,
            onSent: function (r) {

            },
            onSuccess: function (r) {
                Augur.getMarketPriceHistory(market_id, outcome, function (price_logs) {
                    assert.isArray(price_logs);
                    assert.property(price_logs, "length");
                    assert.isAbove(price_logs.length, 0);
                    assert.property(price_logs[0], "price");
                    assert.property(price_logs[0], "blockNumber");
                    done();
                });
            },
            onFailed: function (r) {
                done(r);
            }
        });
    });
    it("price history (sync)", function (done) {
        this.timeout(constants.TIMEOUT);
        Augur.buyShares({
            branchId: branch,
            marketId: market_id,
            outcome: outcome,
            amount: amount,
            onSent: function (r) {

            },
            onSuccess: function (r) {
                var price_logs = Augur.getMarketPriceHistory(market_id, outcome);
                assert.isArray(price_logs);
                assert.property(price_logs, "length");
                assert.isAbove(price_logs.length, 0);
                assert.property(price_logs[0], "price");
                assert.property(price_logs[0], "blockNumber");
                done();
            },
            onFailed: function (r) {
                done(r);
            }
        });
    });
});

describe("updatePrice listener", function () {
    it("should return data on buyShares", function (done) {
        this.timeout(constants.TIMEOUT);
        Augur.filters.start_eth_listener("updatePrice", function (filter_id) {
            var listener = setInterval(function () {
                Augur.filters.poll_eth_listener("updatePrice", function (data) {
                    if (data) {
                        log(data);
                        clearInterval(listener);
                        done();
                    }
                });
            }, 2000);
            setTimeout(function () {
                Augur.buyShares({
                    branchId: branch,
                    marketId: market_id,
                    outcome: outcome,
                    amount: amount,
                    onSent: function (r) {
                        log("sent:", r);
                        log(utils.pp(r));
                    },
                    onSuccess: function (r) {
                        log("success", utils.pp(r));
                    },
                    onFailed: function (r) {
                        done(r);
                    }
                });
            }, 2000);
        });
    });
});
