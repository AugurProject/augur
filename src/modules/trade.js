/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var rpc = require("ethrpc");
var utils = require("../utilities");

module.exports = {

    trade: function (max_value, max_amount, trade_ids, onTradeHash, onCommitSent, onCommitSuccess, onCommitConfirmed, onCommitFailed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed, onTradeConfirmed) {
        var self = this;
        if (max_value.constructor === Object) {
            max_amount = max_value.max_amount;
            trade_ids = max_value.trade_ids;
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
        var tradeHash = this.makeTradeHash(max_value, max_amount, trade_ids);
        onTradeHash(tradeHash);
        this.commitTrade({
            hash: tradeHash,
            onSent: onCommitSent,
            onSuccess: function (res) {
                onCommitSuccess(res);
                self.rpc.fastforward(1, function (blockNumber) {
                    onNextBlock(blockNumber);
                    var tx = clone(self.tx.Trade.trade);
                    tx.params = [
                        abi.fix(max_value, "hex"),
                        abi.fix(max_amount, "hex"),
                        trade_ids
                    ];
                    var prepare = function (result, cb) {
                        if (result.callReturn && result.callReturn.constructor === Array) {
                            result.callReturn[0] = parseInt(result.callReturn[0]);
                            if (result.callReturn[0] === 1 && result.callReturn.length === 3) {
                                return cb({
                                    txHash: result.txHash,
                                    unmatchedCash: abi.unfix(result.callReturn[1], "string"),
                                    unmatchedShares: abi.unfix(result.callReturn[2], "string")
                                });
                            }
                            return cb(result);
                        }
                        var err = self.rpc.errorCodes("trade", "number", result.callReturn);
                        if (!err) return onTradeFailed(result);
                        return onTradeFailed({error: err, message: self.errors[err], tx: tx});
                    };
                    self.transact(tx, onTradeSent, utils.compose(prepare, onTradeSuccess), onTradeFailed, utils.compose(prepare, onTradeConfirmed));
                });
            },
            onFailed: onCommitFailed,
            onConfirmed: onCommitConfirmed
        });
    },

    short_sell: function (buyer_trade_id, max_amount, onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onCommitConfirmed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed, onTradeConfirmed) {
        var self = this;
        if (buyer_trade_id.constructor === Object && buyer_trade_id.buyer_trade_id) {
            max_amount = buyer_trade_id.max_amount;
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
        var tradeHash = this.makeTradeHash(0, max_amount, [buyer_trade_id]);
        onTradeHash(tradeHash);
        this.commitTrade({
            hash: tradeHash,
            onSent: onCommitSent,
            onSuccess: function (res) {
                onCommitSuccess(res);
                self.rpc.fastforward(1, function (blockNumber) {
                    onNextBlock(blockNumber);
                    var tx = clone(self.tx.Trade.short_sell);
                    tx.params = [
                        buyer_trade_id,
                        abi.fix(max_amount, "hex")
                    ];
                    var prepare = function (result, cb) {
                        if (result.callReturn && result.callReturn.constructor === Array) {
                            result.callReturn[0] = parseInt(result.callReturn[0]);
                            if (result.callReturn[0] === 1 && result.callReturn.length === 4) {
                                return cb({
                                    txHash: result.txHash,
                                    unmatchedShares: abi.unfix(result.callReturn[1], "string"),
                                    matchedShares: abi.unfix(result.callReturn[2], "string"),
                                    price: abi.unfix(result.callReturn[3], "string")
                                });
                            }
                            return cb(result);
                        }
                        var err = self.rpc.errorCodes("short_sell", "number", result.callReturn);
                        if (!err) return onTradeFailed(result);
                        return onTradeFailed({error: err, message: self.errors[err], tx: tx});
                    };
                    self.transact(tx, onTradeSent, utils.compose(prepare, onTradeSuccess), onTradeFailed, utils.compose(prepare, onTradeConfirmed));
                });
            },
            onFailed: onCommitFailed,
            onConfirmed: onCommitConfirmed
        });
    }
};
