/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");

module.exports = {

    cancel: function (trade_id, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.cancel);
        var unpacked = utils.unpack(arguments[0], utils.labels(this.cancel), arguments);
        tx.params = unpacked.params;
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    buy: function (amount, price, market, outcome, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.buy);
        var unpacked = utils.unpack(arguments[0], utils.labels(this.buy), arguments);
        tx.params = unpacked.params;
        tx.params[0] = abi.fix(tx.params[0], "hex");
        tx.params[1] = abi.fix(tx.params[1], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    sell: function (amount, price, market, outcome, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.sell);
        var unpacked = utils.unpack(arguments[0], utils.labels(this.sell), arguments);
        tx.params = unpacked.params;
        tx.params[0] = abi.fix(tx.params[0], "hex");
        tx.params[1] = abi.fix(tx.params[1], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    }
};
