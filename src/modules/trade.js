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

    trade: function (max_value, max_amount, trade_ids, onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed) {
        var self = this;
        if (max_value.constructor === Object && max_value.max_value) {
            max_amount = max_value.max_amount;
            trade_ids = max_value.trade_ids;
            onTradeHash = max_value.onTradeHash;
            onCommitSent = max_value.onCommitSent;
            onCommitSuccess = max_value.onCommitSuccess;
            onCommitFailed = max_value.onCommitFailed;
            onNextBlock = max_value.onNextBlock;
            onTradeSent = max_value.onTradeSent;
            onTradeSuccess = max_value.onTradeSuccess;
            onTradeFailed = max_value.onTradeFailed;
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
        this.makeTradeHash(max_value, max_amount, trade_ids, function (tradeHash) {
            onTradeHash(tradeHash);
            self.commitTrade({
                hash: tradeHash,
                onSent: onCommitSent,
                onSuccess: function (res) {
                    onCommitSuccess(res);
                    self.rpc.fastforward(1, function (blockNumber) {
                        onNextBlock(blockNumber);
                        var tx = clone(self.tx.trade);
                        tx.params = [
                            abi.fix(max_value, "hex"),
                            abi.fix(max_amount, "hex"),
                            trade_ids
                        ];
                        self.transact(tx, function (sentResult) {
                            var result = clone(sentResult);
                            if (result.callReturn && result.callReturn.constructor === Array) {
                                result.callReturn[0] = parseInt(result.callReturn[0]);
                                if (result.callReturn[0] === 1 && result.callReturn.length === 3) {
                                    result.callReturn[1] = abi.unfix(result.callReturn[1], "string");
                                    result.callReturn[2] = abi.unfix(result.callReturn[2], "string");
                                }
                            }
                            onTradeSuccess(result);
                        }, function (successResult) {
                            var result = clone(successResult);
                            if (result.callReturn && result.callReturn.constructor === Array) {
                                result.callReturn[0] = parseInt(result.callReturn[0]);
                                if (result.callReturn[0] === 1 && result.callReturn.length === 3) {
                                    result.callReturn[1] = abi.unfix(result.callReturn[1], "string");
                                    result.callReturn[2] = abi.unfix(result.callReturn[2], "string");
                                }
                            }
                            onTradeSuccess(result);
                        }, onTradeFailed);
                    });
                },
                onFailed: onCommitFailed
            });
        });
    },

    short_sell: function (buyer_trade_id, max_amount, onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed) {
        var self = this;
        if (buyer_trade_id.constructor === Object && buyer_trade_id.buyer_trade_id) {
            max_amount = buyer_trade_id.max_amount;
            onTradeHash = buyer_trade_id.onTradeHash;
            onCommitSent = buyer_trade_id.onCommitSent;
            onCommitSuccess = buyer_trade_id.onCommitSuccess;
            onCommitFailed = buyer_trade_id.onCommitFailed;
            onNextBlock = buyer_trade_id.onNextBlock;
            onTradeSent = buyer_trade_id.onTradeSent;
            onTradeSuccess = buyer_trade_id.onTradeSuccess;
            onTradeFailed = buyer_trade_id.onTradeFailed;
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
        this.makeTradeHash(0, max_amount, [buyer_trade_id], function (tradeHash) {
            onTradeHash(tradeHash);
            self.commitTrade({
                hash: tradeHash,
                onSent: onCommitSent,
                onSuccess: function (res) {
                    onCommitSuccess(res);
                    self.rpc.fastforward(1, function (blockNumber) {
                        onNextBlock(blockNumber);
                        var tx = clone(self.tx.short_sell);
                        tx.params = [
                            buyer_trade_id,
                            abi.fix(max_amount, "hex")
                        ];
                        self.transact(tx, function (sentResult) {
                            var result = clone(sentResult);
                            if (result.callReturn && result.callReturn.constructor === Array) {
                                result.callReturn[0] = parseInt(result.callReturn[0]);
                                if (result.callReturn[0] === 1 && result.callReturn.length === 4) {
                                    result.callReturn[1] = abi.unfix(result.callReturn[1], "string");
                                    result.callReturn[2] = abi.unfix(result.callReturn[2], "string");
                                    result.callReturn[3] = abi.unfix(result.callReturn[3], "string");
                                }
                            }
                            onTradeSuccess(result);
                        }, function (successResult) {
                            var result = clone(successResult);
                            if (result.callReturn && result.callReturn.constructor === Array) {
                                result.callReturn[0] = parseInt(result.callReturn[0]);
                                if (result.callReturn[0] === 1 && result.callReturn.length === 4) {
                                    result.callReturn[1] = abi.unfix(result.callReturn[1], "string");
                                    result.callReturn[2] = abi.unfix(result.callReturn[2], "string");
                                    result.callReturn[3] = abi.unfix(result.callReturn[3], "string");
                                }
                            }
                            onTradeSuccess(result);
                        }, onTradeFailed);
                    });
                },
                onFailed: onCommitFailed
            });
        });
    }
};
