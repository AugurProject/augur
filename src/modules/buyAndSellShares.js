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
        var tx = clone(this.tx.BuyAndSellShares.buy);
        tx.params = [abi.fix(amount, "hex"), abi.fix(price, "hex"), market, outcome];
        if (!utils.is_function(onSent)) {
            var res = this.transact(tx);
            res.callReturn = utils.sha3([
                constants.BID,
                market,
                abi.fix(amount, "hex"),
                abi.fix(price, "hex"),
                res.from,
                res.blockNumber,
                parseInt(outcome)
            ]);
            return res;
        }
        this.transact(tx, onSent, function (res) {
            res.callReturn = utils.sha3([
                constants.BID,
                market,
                abi.fix(amount, "hex"),
                abi.fix(price, "hex"),
                res.from,
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
        var tx = clone(this.tx.BuyAndSellShares.sell);
        tx.params = [abi.fix(amount, "hex"), abi.fix(price, "hex"), market, outcome];
        this.transact(tx, onSent, function (res) {
            res.callReturn = utils.sha3([
                constants.ASK,
                market,
                abi.fix(amount, "hex"),
                abi.fix(price, "hex"),
                res.from,
                res.blockNumber,
                parseInt(outcome)
            ]);
            onSuccess(res);
        }, onFailed);
    }
};
