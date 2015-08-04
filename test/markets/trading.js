/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var chalk = require("chalk");
var constants = require("../../src/constants");
var utilities = require("../../src/utilities");
var Augur = utilities.setup(require("../../src"), process.argv.slice(2));
var log = console.log;

require('it-each')({ testPerIteration: true });

var branch = Augur.branches.dev;
var outcome = "1";
var markets = Augur.getMarkets(branch);
var market_id = markets[markets.length - 1];
markets = markets.slice(markets.length - 1);
        
describe("Buy and sell shares", function () {

    it.each(markets, "getNonce: %s", ['element'], function (element, next) {
        var test = function (r) {
            assert.isDefined(r);
            assert.isNotNull(r);
            assert(Number(r) >= 0);
        };
        Augur.getNonce(element, function (r) {
            test(r); next();
        });
    });

    it.each(markets, "buyShares: %s", ['element'], function (element, next) {
        this.timeout(constants.TIMEOUT);
        var amount = "10";
        Augur.buyShares({
            branchId: branch,
            marketId: element,
            outcome: outcome,
            amount: amount,
            nonce: null,
            onSent: function (r) {
                assert.isDefined(r);
                assert.isNotNull(r);
                assert.isDefined(r.callReturn);
                assert.isNotNull(r.callReturn);
                assert.isDefined(r.txHash);
                assert.isNotNull(r.txHash);
                assert.isAbove(Number(r.callReturn), 0);
            },
            onSuccess: function (r) {
                assert.isDefined(r);
                assert.isNotNull(r);
                assert.isDefined(r.callReturn);
                assert.isNotNull(r.callReturn);
                assert.isDefined(r.txHash);
                assert.isNotNull(r.txHash);
                assert.isDefined(r.blockHash);
                assert.isNotNull(r.blockHash);
                assert.isDefined(r.blockNumber);
                assert.isNotNull(r.blockNumber);
                assert.isAbove(parseInt(r.blockNumber), 0);
                assert.isAbove(Number(r.callReturn), 0);
                next();
            },
            onFailed: function (r) {
                next(r);
            }
        });
    });

    it.each(markets, "sellShares: %s", ['element'], function (element, next) {
        this.timeout(constants.TIMEOUT);
        var amount = "1";
        Augur.sellShares({
            branchId: branch,
            marketId: element,
            outcome: outcome,
            amount: amount,
            nonce: null,
            onSent: function (r) {
                assert.isDefined(r);
                assert.isNotNull(r);
                assert.isDefined(r.callReturn);
                assert.isNotNull(r.callReturn);
                assert.isDefined(r.txHash);
                assert.isNotNull(r.txHash);
                assert.isAbove(Number(r.callReturn), 0);
            },
            onSuccess: function (r) {
                assert.isDefined(r);
                assert.isNotNull(r);
                assert.isDefined(r.callReturn);
                assert.isNotNull(r.callReturn);
                assert.isDefined(r.txHash);
                assert.isNotNull(r.txHash);
                assert.isDefined(r.blockHash);
                assert.isNotNull(r.blockHash);
                assert.isDefined(r.blockNumber);
                assert.isNotNull(r.blockNumber);
                assert.isAbove(parseInt(r.blockNumber), 0);
                assert.isAbove(Number(r.callReturn), 0);
                next();
            },
            onFailed: function (r) {
                next(r);
            }
        });
    });

});
