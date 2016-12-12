/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var constants = require("../constants");
var utils = require("../utilities");

var ONE = abi.bignum("1");

module.exports = {

    /***********
     * Parsers *
     ***********/

    parseShortSellLogs: function (logs, isMaker) {
        var marketID, logData, outcomeID, trades;
        trades = {};
        for (var i = 0, n = logs.length; i < n; ++i) {
            if (logs[i] && logs[i].data && logs[i].data !== "0x") {
                marketID = logs[i].topics[1];
                logData = this.rpc.unmarshal(logs[i].data);
                outcomeID = parseInt(logData[3], 16).toString();
                if (!trades[marketID]) trades[marketID] = {};
                if (!trades[marketID][outcomeID]) trades[marketID][outcomeID] = [];
                trades[marketID][outcomeID].push({
                    type: 2,
                    price: abi.unfix(abi.hex(logData[0], true), "string"),
                    shares: abi.unfix(logData[1], "string"),
                    trade_id: logData[2],
                    blockNumber: parseInt(logs[i].blockNumber, 16),
                    maker: !!isMaker
                });
            }
        }
        return trades;
    },

    parseCompleteSetsLogs: function (logs, mergeInto) {
        var marketID, logData, numOutcomes, logTypeCode, parsed;
        parsed = mergeInto || {};
        for (var i = 0, n = logs.length; i < n; ++i) {
            if (logs[i] && logs[i].data !== undefined &&
                logs[i].data !== null && logs[i].data !== "0x") {
                marketID = logs[i].topics[2];
                logTypeCode = parseInt(logs[i].topics[3], 16);
                logData = this.rpc.unmarshal(logs[i].data);
                numOutcomes = parseInt(logData[1], 16);
                if (mergeInto) {
                    if (!parsed[marketID]) parsed[marketID] = {};
                    for (var j = 1; j <= numOutcomes; ++j) {
                        if (!parsed[marketID][j]) parsed[marketID][j] = [];
                        parsed[marketID][j].push({
                            type: logTypeCode,
                            isCompleteSet: true,
                            shares: abi.unfix(logData[0], "string"),
                            price: ONE.dividedBy(abi.bignum(numOutcomes)).toFixed(),
                            blockNumber: parseInt(logs[i].blockNumber, 16)
                        });
                    }
                } else {
                    if (!parsed[marketID]) parsed[marketID] = [];
                    parsed[marketID].push({
                        type: logTypeCode,
                        amount: abi.unfix(logData[0], "string"),
                        numOutcomes: numOutcomes,
                        blockNumber: parseInt(logs[i].blockNumber, 16)
                    });
                }
            }
        }
        return parsed;
    },

    /***********
     * Getters *
     ***********/

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
                        price: abi.unfix(abi.hex(parsed[1], true), "string"),
                        shares: abi.unfix(parsed[2], "string"),
                        trade_id: parsed[3],
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
            topics: [this.api.events.log_fill_tx.signature, abi.format_int256(market)]
        };
        if (!utils.is_function(cb)) {
            return parseMarketPriceHistoryLogs(this.rpc.getLogs(filter));
        }
        this.rpc.getLogs(filter, function (logs) {
            cb(parseMarketPriceHistoryLogs(logs));
        });
    },

    getShortSellLogs: function (account, options, callback) {
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        options = options || {};
        if (account !== undefined && account !== null) {
            var topics = [
                this.api.events.log_short_fill_tx.signature,
                options.market ? abi.format_int256(options.market) : null,
                null,
                null
            ];
            topics[options.maker ? 3 : 2] = abi.format_int256(account);
            var filter = {
                fromBlock: options.fromBlock || "0x1",
                toBlock: options.toBlock || "latest",
                address: this.contracts.Trade,
                topics: topics,
                timeout: constants.GET_LOGS_TIMEOUT
            };
            if (!utils.is_function(callback)) return this.rpc.getLogs(filter);
            this.rpc.getLogs(filter, function (logs) {
                if (!logs || !logs.length) return callback(null, []);
                if (logs && logs.error) return callback(logs, null);
                callback(null, logs);
            });
        }
    },

    getCompleteSetsLogs: function (account, options, callback) {
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        options = options || {};
        if (account !== undefined && account !== null) {
            var typeCode = constants.LOG_TYPE_CODES[options.type] || null;
            var market = options.market ? abi.format_int256(options.market) : null;
            var filter = {
                fromBlock: options.fromBlock || "0x1",
                toBlock: options.toBlock || "latest",
                address: (options.shortAsk) ? this.contracts.BuyAndSellShares : this.contracts.CompleteSets,
                topics: [
                    this.api.events.completeSets_logReturn.signature,
                    abi.format_int256(account),
                    market,
                    typeCode
                ],
                timeout: constants.GET_LOGS_TIMEOUT
            };
            if (!utils.is_function(callback)) return this.rpc.getLogs(filter);
            this.rpc.getLogs(filter, function (logs) {
                if (!logs || !logs.length) return callback(null, []);
                if (logs && logs.error) return callback(logs, null);
                callback(null, logs);
            });
        }
    },

    getAccountCompleteSets: function (account, options, cb) {
        var self = this;
        if (!cb && utils.is_function(options)) {
            cb = options;
            options = null;
        }
        options = options || {};
        if (!account || !utils.is_function(cb)) return;
        var typeCode = constants.LOG_TYPE_CODES[options.type] || null;
        var market = options.market ? abi.format_int256(options.market) : null;
        var topics = [
            this.api.events.completeSets_logReturn.signature,
            abi.format_int256(account),
            market,
            typeCode
        ];
        var fromBlock = options.fromBlock || "0x1";
        var toBlock = options.toBlock || "latest";
        this.rpc.getLogs({
            fromBlock: fromBlock,
            toBlock: toBlock,
            address: this.contracts.CompleteSets,
            topics: topics,
            timeout: constants.GET_LOGS_TIMEOUT
        }, function (completeSetsLogs) {
            if (completeSetsLogs && completeSetsLogs.error) return cb(completeSetsLogs);
            var logs = completeSetsLogs || [];
            self.rpc.getLogs({
                fromBlock: fromBlock,
                toBlock: toBlock,
                address: self.contracts.BuyAndSellShares,
                topics: topics,
                timeout: constants.GET_LOGS_TIMEOUT
            }, function (buyAndSellSharesLogs) {
                var market, logdata, actions, numOutcomes, logTypeCode, logType;
                if (buyAndSellSharesLogs && buyAndSellSharesLogs.error) return cb(buyAndSellSharesLogs);
                logs = logs.concat(buyAndSellSharesLogs);
                actions = {};
                for (var i = 0, n = logs.length; i < n; ++i) {
                    if (logs[i] && logs[i].data !== undefined &&
                        logs[i].data !== null && logs[i].data !== "0x") {
                        market = logs[i].topics[2];
                        logTypeCode = logs[i].topics[3];
                        if (typeCode && logTypeCode !== typeCode) continue;
                        logTypeCode = parseInt(logTypeCode, 16);
                        logdata = self.rpc.unmarshal(logs[i].data);
                        numOutcomes = parseInt(logdata[1], 16);
                        if (options.tradeLogStyle) {
                            if (!actions[market]) actions[market] = {};
                            for (var j = 0; j < numOutcomes; ++j) {
                                if (!actions[market][j + 1]) actions[market][j + 1] = [];
                                actions[market][j + 1].push({
                                    type: logTypeCode,
                                    shares: abi.unfix(logdata[0], "string"),
                                    price: abi.bignum(1).dividedBy(abi.bignum(numOutcomes)).toFixed(),
                                    blockNumber: parseInt(logs[i].blockNumber, 16),
                                    address: logs[i].address
                                });
                            }
                        } else {
                            if (!actions[market]) actions[market] = [];
                            actions[market].push({
                                type: logTypeCode,
                                amount: abi.unfix(logdata[0], "string"),
                                numOutcomes: numOutcomes,
                                blockNumber: parseInt(logs[i].blockNumber, 16),
                                address: logs[i].address
                            });
                        }
                    }
                }
                cb(actions);
            });
        });
    },

    sortByBlockNumber: function (a, b) {
        return a.blockNumber - b.blockNumber;
    },

    getAccountBidsAsks: function (account, options, callback) {
        var self = this;
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        options = options || {};
        if (account !== undefined && account !== null) {
            this.getBidsAsksLogs(account, options, function (err, logs) {
                if (err) return callback(err);
                var bidsAsks = {};
                var parsed;
                for (var i = 0, numLogs = logs.length; i < numLogs; ++i) {
                    parsed = self.filters.parse_event_message("log_add_tx", logs[i]);
                    if (!bidsAsks[parsed.market]) bidsAsks[parsed.market] = [];
                    bidsAsks[parsed.market].push(parsed);
                }
                callback(null, bidsAsks);
            });
        }
    },

    getAccountCancels: function (account, options, callback) {
        var self = this;
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        options = options || {};
        if (account !== undefined && account !== null) {
            this.getCancelLogs(account, options, function (err, logs) {
                if (err) return callback(err);
                var cancels = {};
                var parsed;
                for (var i = 0, numLogs = logs.length; i < numLogs; ++i) {
                    parsed = self.filters.parse_event_message("log_cancel", logs[i]);
                    if (!cancels[parsed.market]) cancels[parsed.market] = [];
                    cancels[parsed.market].push(parsed);
                }
                callback(null, cancels);
            });
        }
    },

    getAccountTrades: function (account, options, cb) {
        var self = this;
        function parseLogs(logs, trades, maker, isShortSell, callback) {
            var market, parsed, outcome;
            if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
                return callback();
            }
            if (logs.error) return cb(logs);
            for (var i = 0, numLogs = logs.length; i < numLogs; ++i) {
                if (logs[i] && logs[i].data && logs[i].data !== "0x") {
                    market = logs[i].topics[1];
                    if (!trades[market]) trades[market] = {};
                    parsed = self.rpc.unmarshal(logs[i].data);
                    if (isShortSell) {
                        outcome = parseInt(parsed[3]);
                        if (!trades[market][outcome]) trades[market][outcome] = [];
                        trades[market][outcome].push({
                            type: 2,
                            price: abi.unfix(abi.hex(parsed[0], true), "string"),
                            shares: abi.unfix(parsed[1], "string"),
                            trade_id: parsed[2],
                            blockNumber: parseInt(logs[i].blockNumber, 16),
                            timestamp: parseInt(parsed[4], 16),
                            transactionHash: logs[i].transactionHash,
                            maker: maker,
                            takerFee: abi.unfix(parsed[5], "string"),
                            makerFee: abi.unfix(parsed[6], "string")
                        });
                    } else {
                        outcome = parseInt(parsed[4]);
                        if (!trades[market][outcome]) trades[market][outcome] = [];
                        trades[market][outcome].push({
                            type: parseInt(parsed[0], 16),
                            price: abi.unfix(abi.hex(parsed[1], true), "string"),
                            shares: abi.unfix(parsed[2], "string"),
                            trade_id: parsed[3],
                            blockNumber: parseInt(logs[i].blockNumber, 16),
                            timestamp: parseInt(parsed[5], 16),
                            transactionHash: logs[i].transactionHash,
                            maker: maker,
                            takerFee: abi.unfix(parsed[6], "string"),
                            makerFee: abi.unfix(parsed[7], "string")
                        });
                    }
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
        var market = options.market ? abi.format_int256(options.market) : null;
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
            timeout: constants.GET_LOGS_TIMEOUT
        }, function (logs) {
            var trades = {};
            parseLogs(logs, trades, true, false, function () {
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
                    timeout: constants.GET_LOGS_TIMEOUT
                }, function (logs) {
                    parseLogs(logs, trades, false, false, function () {
                        self.getMakerShortSellLogs(account, options, function (err, logs) {
                            if (err) return cb(err);
                            parseLogs(logs, trades, true, true, function () {
                                self.getTakerShortSellLogs(account, options, function (err, logs) {
                                    if (err) return cb(err);
                                    parseLogs(logs, trades, false, true, function () {
                                        if (!trades || Object.keys(trades).length === 0) {
                                            return cb(null);
                                        }
                                        if (options.noCompleteSets) {
                                            cb(self.sortTradesByBlockNumber(trades));
                                        } else {
                                            options.shortAsk = false;
                                            options.mergeInto = trades;
                                            self.getParsedCompleteSetsLogs(account, options, function (err, merged) {
                                                if (err) return cb(self.sortTradesByBlockNumber(trades));
                                                cb(self.sortTradesByBlockNumber(merged));
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    });
                });              
            });
        });
    },

    sortTradesByBlockNumber: function (trades) {
        var marketTrades, outcomeTrades, outcomeIDs, numOutcomes;
        var marketIDs = Object.keys(trades);
        var numMarkets = marketIDs.length;
        for (var i = 0; i < numMarkets; ++i) {
            marketTrades = trades[marketIDs[i]];
            outcomeIDs = Object.keys(marketTrades);
            numOutcomes = outcomeIDs.length;
            for (var j = 0; j < numOutcomes; ++j) {
                outcomeTrades = marketTrades[outcomeIDs[j]];
                outcomeTrades = outcomeTrades.sort(this.sortByBlockNumber);
            }
        }
        return trades;
    },

    /************************
     * Convenience wrappers *
     ************************/

    getCancelLogs: function (account, options, callback) {
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        options = options || {};
        if (account !== undefined && account !== null) {
            var topics = [
                this.api.events.log_cancel.signature,
                options.market ? abi.format_int256(options.market) : null,
                abi.format_int256(account)
            ];
            var filter = {
                fromBlock: options.fromBlock || "0x1",
                toBlock: options.toBlock || "latest",
                address: this.contracts.BuyAndSellShares,
                topics: topics,
                timeout: constants.GET_LOGS_TIMEOUT
            };
            if (!utils.is_function(callback)) return this.rpc.getLogs(filter);
            this.rpc.getLogs(filter, function (logs) {
                if (!logs || !logs.length) return callback(null, []);
                if (logs && logs.error) return callback(logs, null);
                callback(null, logs);
            });
        }
    },

    getBidsAsksLogs: function (account, options, callback) {
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        options = options || {};
        if (account !== undefined && account !== null) {
            var topics = [
                this.api.events.log_add_tx.signature,
                options.market ? abi.format_int256(options.market) : null,
                abi.format_int256(account)
            ];
            var filter = {
                fromBlock: options.fromBlock || "0x1",
                toBlock: options.toBlock || "latest",
                address: this.contracts.BuyAndSellShares,
                topics: topics,
                timeout: constants.GET_LOGS_TIMEOUT
            };
            if (!utils.is_function(callback)) return this.rpc.getLogs(filter);
            this.rpc.getLogs(filter, function (logs) {
                if (!logs || !logs.length) return callback(null, []);
                if (logs && logs.error) return callback(logs, null);
                callback(null, logs);
            });
        }
    },

    getMakerShortSellLogs: function (account, options, callback) {
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        options = options || {};
        options.maker = true;
        return this.getShortSellLogs(account, options, callback);
    },

    getTakerShortSellLogs: function (account, options, callback) {
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        options = options || {};
        options.maker = false;
        return this.getShortSellLogs(account, options, callback);
    },

    getMakerTakerShortSellLogs: function (account, options, callback) {
        var self = this;
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        this.getMakerShortSellLogs(account, options, function (err, makerLogs) {
            if (err) return callback(err);
            self.getTakerShortSellLogs(account, options, function (err, takerLogs) {
                if (err) return callback(err);
                callback(null, makerLogs.concat(takerLogs));
            });
        });
    },

    getParsedShortSellLogs: function (account, options, callback) {
        var self = this;
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        options = options || {};
        this.getShortSellLogs(account, options, function (err, logs) {
            if (err) return callback(err);
            callback(null, self.parseShortSellLogs(logs, options.maker));
        });
    },

    getParsedCompleteSetsLogs: function (account, options, callback) {
        var self = this;
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        this.getCompleteSetsLogs(account, options, function (err, logs) {
            if (err) return callback(err);
            callback(null, self.parseCompleteSetsLogs(logs, options.mergeInto));
        });
    },    

    getShortAskBuyCompleteSetsLogs: function (account, options, callback) {
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        var opt = options ? clone(options) : {};
        opt.shortAsk = true;
        opt.type = "buy";
        return this.getCompleteSetsLogs(account, opt, callback);
    },

    getRegularCompleteSetsLogs: function (account, options, callback) {
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        var opt = options ? clone(options) : {};
        opt.shortAsk = false;
        opt.type = null;
        return this.getCompleteSetsLogs(account, opt, callback);
    },

    getBuyCompleteSetsLogs: function (account, options, callback) {
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        var opt = options ? clone(options) : {};
        opt.shortAsk = false;
        opt.type = "buy";
        return this.getCompleteSetsLogs(account, opt, callback);
    },

    getSellCompleteSetsLogs: function (account, options, callback) {
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        var opt = options ? clone(options) : {};
        opt.shortAsk = false;
        opt.type = "sell";
        return this.getCompleteSetsLogs(account, opt, callback);
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
