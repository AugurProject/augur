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

    buy: function (amount, price, market, outcome, onSent, onSuccess, onFailed, onConfirmed) {
        var self = this;
        if (amount.constructor === Object && amount.amount) {
            price = amount.price;
            market = amount.market;
            outcome = amount.outcome;
            onSent = amount.onSent;
            onSuccess = amount.onSuccess;
            onFailed = amount.onFailed;
            onConfirmed = amount.onConfirmed;
            amount = amount.amount;
        }
        onSent = onSent || utils.noop;
        onSuccess = onSuccess || utils.noop;
        onFailed = onFailed || utils.noop;
        var tx = clone(this.tx.BuyAndSellShares.buy);
        tx.params = [abi.fix(amount, "hex"), abi.fix(price, "hex"), market, outcome];
        if (self.options.debug.trading) {
            console.log("buy tx:", JSON.stringify(tx, null, 2));
        }
        return this.transact(tx, onSent, onSuccess, onFailed, onConfirmed);
    },

    sell: function (amount, price, market, outcome, onSent, onSuccess, onFailed, onConfirmed) {
        var self = this;
        if (amount.constructor === Object && amount.amount) {
            price = amount.price;
            market = amount.market;
            outcome = amount.outcome;
            onSent = amount.onSent;
            onSuccess = amount.onSuccess;
            onFailed = amount.onFailed;
            onConfirmed = amount.onConfirmed;
            amount = amount.amount;
        }
        onSent = onSent || utils.noop;
        onSuccess = onSuccess || utils.noop;
        onFailed = onFailed || utils.noop;
        var tx = clone(this.tx.BuyAndSellShares.sell);
        tx.params = [abi.fix(amount, "hex"), abi.fix(price, "hex"), market, outcome];
        if (self.options.debug.trading) {
            console.log("sell tx:", JSON.stringify(tx, null, 2));
        }
        return this.transact(tx, onSent, onSuccess, onFailed, onConfirmed);
    },

    shortAsk: function (amount, price, market, outcome, onSent, onSuccess, onFailed, onConfirmed) {
        var self = this;
        if (amount.constructor === Object && amount.amount) {
            price = amount.price;
            market = amount.market;
            outcome = amount.outcome;
            onSent = amount.onSent;
            onSuccess = amount.onSuccess;
            onFailed = amount.onFailed;
            onConfirmed = amount.onConfirmed;
            amount = amount.amount;
        }
        onSent = onSent || utils.noop;
        onSuccess = onSuccess || utils.noop;
        onFailed = onFailed || utils.noop;
        var tx = clone(this.tx.BuyAndSellShares.shortAsk);
        tx.params = [abi.fix(amount, "hex"), abi.fix(price, "hex"), market, outcome];
        if (self.options.debug.trading) {
            console.log("shortAsk tx:", JSON.stringify(tx, null, 2));
        }
        return this.transact(tx, onSent, onSuccess, onFailed, onConfirmed);
    }
};
