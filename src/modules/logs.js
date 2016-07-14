/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var constants = require("../constants");
var utils = require("../utilities");

BigNumber.config({MODULO_MODE: BigNumber.EUCLID});

module.exports = {

    getMarketPriceHistory: function (market, options, cb) {
        var self = this;
        function parsePriceLogs(logs) {
            if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
                return null;
            }
            if (logs.error) throw new Error(JSON.stringify(logs));
            var outcome, parsed, priceHistory = {};
            for (var i = 0, n = logs.length; i < n; ++i) {
                if (logs[i] && logs[i].data !== undefined &&
                    logs[i].data !== null && logs[i].data !== "0x") {
                    parsed = self.rpc.unmarshal(logs[i].data);
                    outcome = parseInt(parsed[4], 16);
                    if (!priceHistory[outcome]) priceHistory[outcome] = [];
                    priceHistory[outcome].push({
                        market: market,
                        type: parseInt(parsed[0], 16),
                        user: abi.format_address(logs[i].topics[2]),
                        price: abi.unfix(parsed[1], "string"),
                        shares: abi.unfix(parsed[2], "string"),
                        timestamp: parseInt(parsed[3], 16),
                        blockNumber: parseInt(logs[i].blockNumber, 16)
                    });
                }
            }
            return priceHistory;
        }
        if (!cb && utils.is_function(options)) {
            cb = options;
            options = null;
        }
        options = options || {};
        var filter = {
            fromBlock: options.fromBlock || "0x1",
            toBlock: options.toBlock || "latest",
            address: this.contracts.Trade,
            topics: [this.api.events.log_price.signature, market]
        };
        if (!utils.is_function(cb)) {
            return parsePriceLogs(this.rpc.getLogs(filter));
        }
        this.rpc.getLogs(filter, function (logs) {
            cb(parsePriceLogs(logs));
        });
    },

    meanTradePrice: function (trades, sell) {
        var price, shares, totalShares, outcomeMeanPrice, meanPrice = {};
        function include(shares) {
            return (sell) ? shares.lt(new BigNumber(0)) : shares.gt(new BigNumber(0));
        }
        for (var outcome in trades) {
            if (!trades.hasOwnProperty(outcome)) continue;
            outcomeMeanPrice = new BigNumber(0);
            totalShares = new BigNumber(0);
            for (var i = 0, n = trades[outcome].length; i < n; ++i) {
                price = new BigNumber(trades[outcome][i].price, 10);
                shares = new BigNumber(trades[outcome][i].amount, 10);
                if (include(shares)) {
                    outcomeMeanPrice = outcomeMeanPrice.plus(price.mul(shares));
                    totalShares = totalShares.plus(shares);
                }
            }
            if (include(totalShares)) {
                meanPrice[outcome] = outcomeMeanPrice.dividedBy(totalShares).toFixed();
            }
        }
        return meanPrice;
    },

    getAccountTrades: function (account, options, cb) {
        var self = this;
        if (!cb && utils.is_function(options)) {
            cb = options;
            options = null;
        }
        options = options || {};
        if (!account || !utils.is_function(cb)) return;
        this.rpc.getLogs({
            fromBlock: options.fromBlock || "0x1",
            toBlock: options.toBlock || "latest",
            address: this.contracts.Trade,
            topics: [
                this.api.events.log_price.signature,
                null,
                abi.format_int256(account)
            ],
            timeout: 480000
        }, function (logs) {
            if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
                return cb(null);
            }
            if (logs.error) return cb(logs);
            var market, outcome, parsed, price, timestamp, shares, type, trades = {};
            for (var i = 0, n = logs.length; i < n; ++i) {
                if (logs[i] && logs[i].data !== undefined &&
                    logs[i].data !== null && logs[i].data !== "0x") {
                    market = logs[i].topics[1];
                    if (!trades[market]) trades[market] = {};
                    parsed = self.rpc.unmarshal(logs[i].data);
                    outcome = parseInt(parsed[4]);
                    if (!trades[market][outcome]) trades[market][outcome] = [];
                    trades[market][outcome].push({
                        type: parseInt(parsed[0], 16),
                        market: market,
                        price: abi.unfix(parsed[1], "string"),
                        shares: abi.unfix(parsed[2], "string"),
                        timestamp: parseInt(parsed[3], 16),
                        blockNumber: parseInt(logs[i].blockNumber, 16)
                    });
                }
            }
            cb(trades);
        });
    },

    getAccountMeanTradePrices: function (account, cb) {
        var self = this;
        if (!utils.is_function(cb)) return;
        this.getAccountTrades(account, function (trades) {
            if (!trades) return cb(null);
            if (trades.error) return (trades);
            var meanPrices = {buy: {}, sell: {}};
            for (var marketId in trades) {
                if (!trades.hasOwnProperty(marketId)) continue;
                meanPrices.buy[marketId] = self.meanTradePrice(trades[marketId]);
                meanPrices.sell[marketId] = self.meanTradePrice(trades[marketId], true);
            }
            cb(meanPrices);
        });
    }
};
