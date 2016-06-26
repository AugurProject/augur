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

    cancel: function (trade_id, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.buyAndSellShares.cancel);
        var unpacked = utils.unpack(arguments[0], utils.labels(this.cancel), arguments);
        tx.params = unpacked.params;
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    buy: function (amount, price, market, outcome, onSent, onSuccess, onFailed) {
        var self = this;
        if (amount.constructor === Object && amount.amount) {
            price = amount.price;
            market = amount.market;
            outcome = amount.outcome;
            onSent = amount.onSent;
            onSuccess = amount.onSuccess;
            onFailed = amount.onFailed;
            amount = amount.amount;
        }
        onSent = onSent || utils.noop;
        onSuccess = onSuccess || utils.noop;
        onFailed = onFailed || utils.noop;
        var tx = clone(this.tx.buyAndSellShares.buy);
        tx.params = [abi.fix(amount, "hex"), abi.fix(price, "hex"), market, outcome];
        this.transact(tx, onSent, function (res) {
            res.callReturn = utils.sha3([
                constants.BID,
                market,
                abi.fix(amount, "hex"),
                abi.fix(price, "hex"),
                self.from,
                res.blockNumber,
                parseInt(outcome)
            ]);
            onSuccess(res);
        }, onFailed);
    },

    sell: function (amount, price, market, outcome, onSent, onSuccess, onFailed) {
        var self = this;
        if (amount.constructor === Object && amount.amount) {
            price = amount.price;
            market = amount.market;
            outcome = amount.outcome;
            onSent = amount.onSent;
            onSuccess = amount.onSuccess;
            onFailed = amount.onFailed;
            amount = amount.amount;
        }
        onSent = onSent || utils.noop;
        onSuccess = onSuccess || utils.noop;
        onFailed = onFailed || utils.noop;
        var tx = clone(this.tx.buyAndSellShares.sell);
        tx.params = [abi.fix(amount, "hex"), abi.fix(price, "hex"), market, outcome];
        this.transact(tx, onSent, function (res) {
            res.callReturn = utils.sha3([
                constants.ASK,
                market,
                abi.fix(amount, "hex"),
                abi.fix(price, "hex"),
                self.from,
                res.blockNumber,
                parseInt(outcome)
            ]);
            onSuccess(res);
        }, onFailed);
    }
};
