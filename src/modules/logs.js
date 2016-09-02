/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var constants = require("../constants");
var utils = require("../utilities");

BigNumber.config({
    MODULO_MODE: BigNumber.EUCLID,
    ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN
});

module.exports = {

    getMarketPriceHistory: function (market, options, cb) {
        var self = this;
        function parseMarketPriceHistoryLogs(logs) {
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
                        timestamp: parseInt(parsed[5], 16),
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
            topics: [this.api.events.log_fill_tx.signature, market]
        };
        if (!utils.is_function(cb)) {
            return parseMarketPriceHistoryLogs(this.rpc.getLogs(filter));
        }
        this.rpc.getLogs(filter, function (logs) {
            cb(parseMarketPriceHistoryLogs(logs));
        });
    },

    getAccountHistory: function (account, options, cb) {
        var self = this;
        if (!cb && utils.is_function(options)) {
            cb = options;
            options = null;
        }
        options = options || {};
        if (!account || !utils.is_function(cb)) return;
        var accountHistory = {};
        self.getAccountTrades(account, options, function (accountTrades) {
            if (accountTrades && accountTrades.error) return cb(accountTrades);
            accountHistory.trades = accountTrades;
            self.getAccountCompleteSets(account, options, function (accountCompleteSets) {
                if (accountCompleteSets && accountCompleteSets.error) return cb(accountCompleteSets);
                accountHistory.completeSets = accountCompleteSets;
                cb(null, accountHistory);
            });
        });
    },

    getAccountCompleteSets: function (account, options, cb) {
        var self = this;
        if (!cb && utils.is_function(options)) {
            cb = options;
            options = null;
        }
        options = options || {};
        if (!account || !utils.is_function(cb)) return;
        var typeCode;
        switch (options.type) {
        case "buy":
            typeCode = abi.format_int256(1);
            break;
        case "sell":
            typeCode = abi.format_int256(2);
            break;
        default:
            typeCode = null;
        }
        var market = (options.market) ? abi.format_int256(options.market) : null;
        this.rpc.getLogs({
            fromBlock: options.fromBlock || "0x1",
            toBlock: options.toBlock || "latest",
            address: this.contracts.CompleteSets,
            topics: [
                this.api.events.completeSets_logReturn.signature,
                abi.format_int256(account),
                market,
                typeCode
            ],
            timeout: 480000
        }, function (logs) {
            var market, logdata, actions, numOutcomes, logTypeCode, logType;
            if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
                return cb(null);
            }
            if (logs.error) return cb(logs);
            actions = {buy: {}, sell: {}};
            for (var i = 0, n = logs.length; i < n; ++i) {
                if (logs[i] && logs[i].data !== undefined &&
                    logs[i].data !== null && logs[i].data !== "0x") {
                    market = logs[i].topics[2];
                    logTypeCode = logs[i].topics[3];
                    if (typeCode && logTypeCode !== typeCode) continue;
                    logType = (parseInt(logTypeCode, 16) === 1) ? "buy" : "sell";
                    logdata = self.rpc.unmarshal(logs[i].data);
                    numOutcomes = parseInt(logdata[1], 16);
                    if (options.tradeLogStyle) {
                        if (!actions[logType][market]) actions[logType][market] = {};
                        for (var j = 0; j < numOutcomes; ++j) {
                            if (!actions[logType][market][j + 1]) actions[logType][market][j + 1] = [];
                            actions[logType][market][j + 1].push({
                                shares: abi.unfix(logdata[0], "string"),
                                price: abi.bignum(1).dividedBy(abi.bignum(numOutcomes)).toFixed(),
                                blockNumber: parseInt(logs[i].blockNumber, 16)
                            });
                        }
                    } else {
                        if (!actions[logType][market]) actions[logType][market] = [];
                        actions[logType][market].push({
                            amount: abi.unfix(logdata[0], "string"),
                            numOutcomes: numOutcomes,
                            blockNumber: parseInt(logs[i].blockNumber, 16)
                        });
                    }
                }
            }
            cb(actions);
        });
    },

    getAccountTrades: function (account, options, cb) {
        var self = this;

        function parseLogs(logs, trades, maker, callback) {
            if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
                return callback();
            }
            if (logs.error) return cb(logs);
            
            for (var i = 0, n = logs.length; i < n; ++i) {
                if (logs[i] && logs[i].data !== undefined &&
                    logs[i].data !== null && logs[i].data !== "0x") {
                    var market = logs[i].topics[1];
                    if (!trades[market]) trades[market] = {};
                    var parsed = self.rpc.unmarshal(logs[i].data);
                    var outcome = parseInt(parsed[4]);
                    if (!trades[market][outcome]) trades[market][outcome] = [];
                    trades[market][outcome].push({
                        type: parseInt(parsed[0], 16),
                        price: abi.unfix(parsed[1], "string"),
                        shares: abi.unfix(parsed[2], "string"),
                        trade_id: parsed[3],
                        blockNumber: parseInt(logs[i].blockNumber, 16),
                        maker: maker
                    });
                }
            }
            return callback();
        }

        if (!cb && utils.is_function(options)) {
            cb = options;
            options = null;
        }
        options = options || {};

        if (!account || !utils.is_function(cb)) return;

        var market = (options.market) ? abi.format_int256(options.market) : null;

        this.rpc.getLogs({
            fromBlock: options.fromBlock || "0x1",
            toBlock: options.toBlock || "latest",
            address: this.contracts.Trade,
            topics: [
                this.api.events.log_fill_tx.signature,
                market,
                null,
                abi.format_int256(account)
            ],
            timeout: 480000
        }, function (logs) {
            var trades = {};
            parseLogs(logs, trades, true, function () {
                self.rpc.getLogs({
                    fromBlock: options.fromBlock || "0x1",
                    toBlock: options.toBlock || "latest",
                    address: self.contracts.Trade,
                    topics: [
                        self.api.events.log_fill_tx.signature,
                        market,
                        abi.format_int256(account),
                        null
                    ],
                    timeout: 480000
                }, function (logs) {
                    parseLogs(logs, trades, false, function () {
                        if (!trades || Object.keys(trades).length === 0) {
                            return cb(null);
                        }
                        cb(trades);
                    });
                });              
            });
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
    },

    getMarketTrades: function (marketID, options, cb) {
        var self = this;

        function parseMarketTrades(logs, callback) {
            if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
                return callback();
            }
            if (logs.error) return cb(logs);

            var trades = {};

            for (var i = 0, n = logs.length; i < n; ++i) {
                if (logs[i] && logs[i].data !== undefined &&
                    logs[i].data !== null && logs[i].data !== "0x") {
                    var parsed = self.rpc.unmarshal(logs[i].data);
                    var outcome = parseInt(parsed[4]);
                    if (!trades[outcome]) trades[outcome] = [];
                    trades[outcome].push({
                        type: parseInt(parsed[0], 16),
                        price: abi.unfix(parsed[1], "string"),
                        shares: abi.unfix(parsed[2], "string"),
                        trade_id: parsed[3],
                        blockNumber: parseInt(logs[i].blockNumber, 16)
                    });
                }
            }
            return callback(trades);
        }

        if (!cb && utils.is_function(options)) {
            cb = options;
            options = null;
        }
        options = options || {};

        if (!marketID || !utils.is_function(cb)) return;

        this.rpc.getLogs({
            fromBlock: options.fromBlock || "0x1",
            toBlock: options.toBlock || "latest",
            address: this.contracts.Trade,
            topics: [
                this.api.events.log_fill_tx.signature,
                abi.format_int256(marketID)
            ],
            timeout: 480000
        }, function (logs) {
            parseMarketTrades(logs, function (trades) {
                if (!trades || Object.keys(trades).length === 0) {
                    return cb(null);
                }
                cb(trades);
            });
        });
    }
};
