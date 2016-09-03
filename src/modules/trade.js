/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var async = require("async");
var abi = require("augur-abi");
var rpc = require("ethrpc");
var utils = require("../utilities");
var constants = require("../constants");
var abacus = require("./abacus");

module.exports = {

    // tradeTypes: array of "buy" and/or "sell"
    // gasLimit (optional): block gas limit as integer
    isUnderGasLimit: function (tradeTypes, gasLimit, callback) {
        if (utils.is_function(gasLimit) && !callback) {
            callback = gasLimit;
            gasLimit = null;
        }
        var gas = abacus.sumTradeGas(tradeTypes);
        if (!utils.is_function(callback)) {
            if (gasLimit) return gas <= gasLimit;
            return gas <= parseInt(this.rpc.getBlock(this.rpc.blockNumber()).gasLimit, 16);
        }
        if (gasLimit) return callback(gas <= gasLimit);
        var self = this;
        this.rpc.blockNumber(function (blockNumber) {
            self.rpc.getBlock(blockNumber, false, function (block) {
                callback(gas <= parseInt(block.gasLimit, 16));
            });
        });
    },

    checkGasLimit: function (trade_ids, sender, callback) {
        var self = this;
        var gas = 0;
        var count = {buy: 0, sell: 0};
        self.rpc.blockNumber(function (blockNumber) {
            self.rpc.getBlock(blockNumber, false, function (block) {
                async.forEachOfSeries(trade_ids, function (trade_id, i, next) {
                    self.get_trade(trade_id, function (trade) {
                        if (!trade || !trade.id) {
                            return next(self.errors.TRADE_NOT_FOUND);
                        } else if (trade.owner === sender) {
                            return next({error: "-5", message: self.errors.trade["-5"]});
                        }
                        ++count[trade.type];
                        gas += constants.TRADE_GAS[Number(!!i)][trade.type];
                        next();
                    });
                }, function (e) {
                    if (e) return callback(e);
                    if (gas <= parseInt(block.gasLimit, 16)) {
                        return callback(null, trade_ids);
                    } else if (!count.buy || !count.sell) {
                        var type = (count.buy) ? "buy" : "sell";
                        return callback(null, trade_ids.slice(0, abacus.maxOrdersPerTrade(type, block.gasLimit)));
                    }
                    callback(self.errors.GAS_LIMIT_EXCEEDED);
                });
            });
        });
    },

    trade: function (max_value, max_amount, trade_ids, sender, onTradeHash, onCommitSent, onCommitSuccess, onCommitConfirmed, onCommitFailed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed, onTradeConfirmed) {
        var self = this;
        if (this.options.debug.trading) {
            console.log("trade:", JSON.stringify(max_value, null, 2));
        }
        if (max_value.constructor === Object) {
            max_amount = max_value.max_amount;
            trade_ids = max_value.trade_ids;
            sender = max_value.sender;
            onTradeHash = max_value.onTradeHash;
            onCommitSent = max_value.onCommitSent;
            onCommitSuccess = max_value.onCommitSuccess;
            onCommitFailed = max_value.onCommitFailed;
            onCommitConfirmed = max_value.onCommitConfirmed;
            onNextBlock = max_value.onNextBlock;
            onTradeSent = max_value.onTradeSent;
            onTradeSuccess = max_value.onTradeSuccess;
            onTradeFailed = max_value.onTradeFailed;
            onTradeConfirmed = max_value.onTradeConfirmed;
            max_value = max_value.max_value;
        }
        onTradeHash = onTradeHash || utils.noop;
        onCommitSent = onCommitSent || utils.noop;
        onCommitSuccess = onCommitSuccess || utils.noop;
        onCommitFailed = onCommitFailed || utils.noop;
        onNextBlock = onNextBlock || utils.noop;
        onTradeSent = onTradeSent || utils.noop;
        onTradeSuccess = onTradeSuccess || utils.noop;
        onTradeFailed = onTradeFailed || utils.noop;
        this.checkGasLimit(trade_ids, abi.format_address(sender || this.from), function (err, trade_ids) {
            if (err) return onTradeFailed(err);
            var bn_max_value = abi.bignum(max_value);
            if (bn_max_value.gt(constants.ZERO) && bn_max_value.lt(constants.MINIMUM_TRADE_SIZE)) {
                return onTradeFailed({error: "-4", message: self.errors.trade["-4"]});
            }
            var tradeHash = self.makeTradeHash(max_value, max_amount, trade_ids);
            onTradeHash(tradeHash);
            self.commitTrade({
                hash: tradeHash,
                onSent: onCommitSent,
                onSuccess: function (res) {
                    onCommitSuccess(res);
                    self.rpc.fastforward(1, function (blockNumber) {
                        onNextBlock(blockNumber);
                        var tx = clone(self.tx.Trade.trade);
                        tx.params = [abi.fix(max_value, "hex"), abi.fix(max_amount, "hex"), trade_ids];
                        if (self.options.debug.trading) {
                            console.log("trade tx:", JSON.stringify(tx, null, 2));
                        }
                        var prepare = function (result, cb) {
                            if (self.options.debug.trading) {
                                console.log("trade response:", JSON.stringify(result, null, 2));
                            }
                            var err;
                            var txHash = result.txHash;
                            if (result.callReturn && result.callReturn.constructor === Array) {
                                result.callReturn[0] = parseInt(result.callReturn[0], 16);
                                if (result.callReturn[0] !== 1 || result.callReturn.length !== 3) {
                                    err = self.rpc.errorCodes("trade", "number", result.callReturn[0]);
                                    if (!err) {
                                        err = clone(self.errors.TRADE_FAILED);
                                        err.message += result.callReturn[0].toString();
                                        return onTradeFailed(err);
                                    }
                                    return onTradeFailed({error: err, message: self.errors.trade[err], tx: tx});
                                }
                                self.rpc.receipt(txHash, function (receipt) {
                                    if (!receipt) return onTradeFailed(self.errors.TRANSACTION_RECEIPT_NOT_FOUND);
                                    if (receipt.error) return onTradeFailed(receipt);
                                    var sharesBought, cashFromTrade, tradingFees, logs, sig, logdata;
                                    if (receipt && receipt.logs && receipt.logs.constructor === Array && receipt.logs.length) {
                                        logs = receipt.logs;
                                        sig = self.api.events.log_fill_tx.signature;
                                        sharesBought = constants.ZERO;
                                        cashFromTrade = constants.ZERO;
                                        tradingFees = constants.ZERO;
                                        for (var i = 0, numLogs = logs.length; i < numLogs; ++i) {
                                            if (logs[i].topics[0] === sig) {
                                                logdata = self.rpc.unmarshal(logs[i].data);
                                                if (logdata && logdata.constructor === Array && logdata.length) {
                                                    tradingFees = tradingFees.plus(abi.unfix(logdata[6]));

                                                    // buy (matched sell order)
                                                    if (parseInt(logdata[0], 16) === 1) {
                                                        sharesBought = sharesBought.plus(abi.unfix(logdata[2]));

                                                    // sell (matched buy order)
                                                    // cash received = price per share * shares sold
                                                    } else {
                                                        cashFromTrade = cashFromTrade.plus(abi.unfix(logdata[1]).times(abi.unfix(logdata[2])));
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    cb({
                                        txHash: txHash,
                                        unmatchedCash: abi.unfix(result.callReturn[1], "string"),
                                        unmatchedShares: abi.unfix(result.callReturn[2], "string"),
                                        sharesBought: abi.string(sharesBought),
                                        cashFromTrade: abi.string(cashFromTrade),
                                        tradingFees: abi.string(tradingFees),
                                        gasFees: result.gasFees
                                    });
                                });
                            } else {
                                err = self.rpc.errorCodes("trade", "number", result.callReturn);
                                if (!err) {
                                    err = clone(self.errors.TRADE_FAILED);
                                    err.message += result.callReturn.toString();
                                    return onTradeFailed(result);
                                }
                                onTradeFailed({error: err, message: self.errors[err], tx: tx});
                            }
                        };
                        self.transact(tx, onTradeSent, utils.compose(prepare, onTradeSuccess), onTradeFailed, utils.compose(prepare, onTradeConfirmed));
                    });
                },
                onFailed: onCommitFailed,
                onConfirmed: onCommitConfirmed
            });
        });
    },

    short_sell: function (buyer_trade_id, max_amount, sender, onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onCommitConfirmed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed, onTradeConfirmed) {
        var self = this;
        if (this.options.debug.trading) {
            console.log("short_sell:", JSON.stringify(buyer_trade_id, null, 2));
        }
        if (buyer_trade_id.constructor === Object && buyer_trade_id.buyer_trade_id) {
            max_amount = buyer_trade_id.max_amount;
            sender = buyer_trade_id.sender;
            onTradeHash = buyer_trade_id.onTradeHash;
            onCommitSent = buyer_trade_id.onCommitSent;
            onCommitSuccess = buyer_trade_id.onCommitSuccess;
            onCommitFailed = buyer_trade_id.onCommitFailed;
            onCommitConfirmed = buyer_trade_id.onCommitConfirmed;
            onNextBlock = buyer_trade_id.onNextBlock;
            onTradeSent = buyer_trade_id.onTradeSent;
            onTradeSuccess = buyer_trade_id.onTradeSuccess;
            onTradeFailed = buyer_trade_id.onTradeFailed;
            onTradeConfirmed = buyer_trade_id.onTradeConfirmed;
            buyer_trade_id = buyer_trade_id.buyer_trade_id;
        }
        onTradeHash = onTradeHash || utils.noop;
        onCommitSent = onCommitSent || utils.noop;
        onCommitSuccess = onCommitSuccess || utils.noop;
        onCommitFailed = onCommitFailed || utils.noop;
        onNextBlock = onNextBlock || utils.noop;
        onTradeSent = onTradeSent || utils.noop;
        onTradeSuccess = onTradeSuccess || utils.noop;
        onTradeFailed = onTradeFailed || utils.noop;
        this.checkGasLimit([buyer_trade_id], abi.format_address(sender || this.from), function (err, trade_ids) {
            if (err) return onTradeFailed(err);
            var tradeHash = self.makeTradeHash(0, max_amount, trade_ids);
            onTradeHash(tradeHash);
            self.commitTrade({
                hash: tradeHash,
                onSent: onCommitSent,
                onSuccess: function (res) {
                    onCommitSuccess(res);
                    self.rpc.fastforward(1, function (blockNumber) {
                        onNextBlock(blockNumber);
                        var tx = clone(self.tx.Trade.short_sell);
                        tx.params = [buyer_trade_id, abi.fix(max_amount, "hex")];
                        if (self.options.debug.trading) {
                            console.log("short_sell tx:", JSON.stringify(tx, null, 2));
                        }
                        var prepare = function (result, cb) {
                            if (self.options.debug.trading) {
                                console.log("short_sell response:", JSON.stringify(result, null, 2));
                            }
                            var err;
                            var txHash = result.txHash;
                            if (result.callReturn && result.callReturn.constructor === Array) {
                                result.callReturn[0] = parseInt(result.callReturn[0], 16);
                                if (result.callReturn[0] !== 1 || result.callReturn.length !== 4) {
                                    err = self.rpc.errorCodes("short_sell", "number", result.callReturn[0]);
                                    if (!err) {
                                        err = clone(self.errors.TRADE_FAILED);
                                        err.message += result.callReturn[0].toString();
                                        return onTradeFailed(err);
                                    }
                                    return onTradeFailed({error: err, message: self.errors.short_sell[err], tx: tx});
                                }
                                self.rpc.receipt(txHash, function (receipt) {
                                    if (!receipt) return onTradeFailed(self.errors.TRANSACTION_RECEIPT_NOT_FOUND);
                                    if (receipt.error) return onTradeFailed(receipt);
                                    var cashFromTrade, tradingFees, logs, sig, logdata;
                                    if (receipt && receipt.logs && receipt.logs.constructor === Array && receipt.logs.length) {
                                        logs = receipt.logs;
                                        sig = self.api.events.log_fill_tx.signature;
                                        cashFromTrade = constants.ZERO;
                                        tradingFees = constants.ZERO;
                                        for (var i = 0, numLogs = logs.length; i < numLogs; ++i) {
                                            if (logs[i].topics[0] === sig) {
                                                logdata = self.rpc.unmarshal(logs[i].data);
                                                if (logdata && logdata.constructor === Array && logdata.length) {
                                                    cashFromTrade = cashFromTrade.plus(abi.unfix(logdata[1]).times(abi.unfix(logdata[2])));
                                                    tradingFees = tradingFees.plus(abi.unfix(logdata[6]));
                                                }
                                            }
                                        }
                                    }
                                    cb({
                                        txHash: txHash,
                                        unmatchedShares: abi.unfix(result.callReturn[1], "string"),
                                        matchedShares: abi.unfix(result.callReturn[2], "string"),
                                        cashFromTrade: abi.string(cashFromTrade),
                                        price: abi.unfix(result.callReturn[3], "string"),
                                        tradingFees: abi.string(tradingFees),
                                        gasFees: result.gasFees
                                    });
                                });
                            } else {
                                err = self.rpc.errorCodes("short_sell", "number", result.callReturn);
                                if (!err) {
                                    err = clone(self.errors.TRADE_FAILED);
                                    err.message += result.callReturn.toString();
                                    return onTradeFailed(result);
                                }
                                onTradeFailed({error: err, message: self.errors.short_sell[err], tx: tx});
                            }
                        };
                        self.transact(tx, onTradeSent, utils.compose(prepare, onTradeSuccess), onTradeFailed, utils.compose(prepare, onTradeConfirmed));
                    });
                },
                onFailed: onCommitFailed,
                onConfirmed: onCommitConfirmed
            });
        });
    }
};
