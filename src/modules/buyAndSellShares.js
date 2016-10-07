/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");
var constants = require("../constants");

module.exports = {

    cancel: function (trade_id, onSent, onSuccess, onFailed, onConfirmed) {
        if (this.options.debug.trading) {
            console.log("cancel:", JSON.stringify(trade_id, null, 2));
        }
        var self = this;
        if (trade_id.constructor === Object) {
            onSent = trade_id.onSent;
            onSuccess = trade_id.onSuccess;
            onFailed = trade_id.onFailed;
            onConfirmed = trade_id.onConfirmed;
            trade_id = trade_id.trade_id;
        }
        onSent = onSent || utils.noop;
        onSuccess = onSuccess || utils.noop;
        onFailed = onFailed || utils.noop;
        var tx = clone(this.tx.BuyAndSellShares.cancel);
        tx.params = trade_id;
        if (this.options.debug.trading) {
            console.log("cancel tx:", JSON.stringify(tx, null, 2));
        }
        var prepare = function (result, cb) {
            if (!result || !result.callReturn) return cb(result);
            self.rpc.receipt(result.hash, function (receipt) {
                if (!receipt) return onFailed(self.errors.TRANSACTION_RECEIPT_NOT_FOUND);
                if (receipt.error) return onFailed(receipt);
                if (receipt && receipt.logs && receipt.logs.constructor === Array && receipt.logs.length) {
                    var logs = receipt.logs;
                    var sig = self.api.events.log_cancel.signature;
                    result.cashRefund = "0";
                    var numLogs = logs.length;
                    var logdata;
                    for (var i = 0; i < numLogs; ++i) {
                        if (logs[i].topics[0] === sig) {
                            logdata = self.rpc.unmarshal(logs[i].data);
                            if (logdata && logdata.constructor === Array && logdata.length) {
                                result.cashRefund = abi.unfix(logdata[5], "string");
                                break;
                            }
                        }
                    }
                }
                cb(result);
            });
        };
        this.transact(tx,
            onSent,
            utils.compose(prepare, onSuccess),
            onFailed,
            utils.compose(prepare, onConfirmed));
    },

    buy: function (amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed, onConfirmed) {
        if (this.options.debug.trading) {
            console.log("buy:", JSON.stringify(amount, null, 2));
        }
        if (amount.constructor === Object && amount.amount) {
            price = amount.price;
            market = amount.market;
            outcome = amount.outcome;
            scalarMinMax = amount.scalarMinMax;
            onSent = amount.onSent;
            onSuccess = amount.onSuccess;
            onFailed = amount.onFailed;
            onConfirmed = amount.onConfirmed;
            amount = amount.amount;
        }
        onSent = onSent || utils.noop;
        onSuccess = onSuccess || utils.noop;
        onFailed = onFailed || utils.noop;
        if (scalarMinMax && scalarMinMax.minValue !== undefined) {
            console.log('raw price:', price);
            price = this.shrinkScalarPrice(scalarMinMax.minValue, price);
            console.log('adjusted price:', price);
        }
        var tx = clone(this.tx.BuyAndSellShares.buy);
        tx.params = [abi.fix(amount, "hex"), abi.fix(price, "hex"), market, outcome];
        if (this.options.debug.trading) {
            console.log("buy tx:", JSON.stringify(tx, null, 2));
        }
        return this.transact(tx, onSent, onSuccess, onFailed, onConfirmed);
    },

    sell: function (amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed, onConfirmed) {
        if (this.options.debug.trading) {
            console.log("sell:", JSON.stringify(amount, null, 2));
        }
        if (amount.constructor === Object && amount.amount) {
            price = amount.price;
            market = amount.market;
            outcome = amount.outcome;
            scalarMinMax = amount.scalarMinMax;
            onSent = amount.onSent;
            onSuccess = amount.onSuccess;
            onFailed = amount.onFailed;
            onConfirmed = amount.onConfirmed;
            amount = amount.amount;
        }
        onSent = onSent || utils.noop;
        onSuccess = onSuccess || utils.noop;
        onFailed = onFailed || utils.noop;
        if (scalarMinMax && scalarMinMax.maxValue !== undefined) {
            console.log('raw price:', price);
            price = this.adjustScalarSellPrice(scalarMinMax.maxValue, price);
            console.log('adjusted price:', price);
        }
        var tx = clone(this.tx.BuyAndSellShares.sell);
        tx.params = [abi.fix(amount, "hex"), abi.fix(price, "hex"), market, outcome];
        if (this.options.debug.trading) {
            console.log("sell tx:", JSON.stringify(tx, null, 2));
        }
        return this.transact(tx, onSent, onSuccess, onFailed, onConfirmed);
    },

    shortAsk: function (amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed, onConfirmed) {
        if (this.options.debug.trading) {
            console.log("shortAsk:", JSON.stringify(amount, null, 2));
        }
        if (amount.constructor === Object && amount.amount) {
            price = amount.price;
            market = amount.market;
            outcome = amount.outcome;
            scalarMinMax = amount.scalarMinMax;
            onSent = amount.onSent;
            onSuccess = amount.onSuccess;
            onFailed = amount.onFailed;
            onConfirmed = amount.onConfirmed;
            amount = amount.amount;
        }
        onSent = onSent || utils.noop;
        onSuccess = onSuccess || utils.noop;
        onFailed = onFailed || utils.noop;
        if (scalarMinMax && scalarMinMax.maxValue !== undefined) {
            console.log('raw price:', price);
            price = this.adjustScalarSellPrice(scalarMinMax.maxValue, price);
            console.log('adjusted price:', price);
        }
        var tx = clone(this.tx.BuyAndSellShares.shortAsk);
        tx.params = [abi.fix(amount, "hex"), abi.fix(price, "hex"), market, outcome];
        if (this.options.debug.trading) {
            console.log("shortAsk tx:", JSON.stringify(tx, null, 2));
        }
        return this.transact(tx, onSent, onSuccess, onFailed, onConfirmed);
    }
};
