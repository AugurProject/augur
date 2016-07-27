/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");

module.exports = {

    buyCompleteSets: function (market, amount, onSent, onSuccess, onFailed, onConfirmed) {
        var tx = clone(this.tx.CompleteSets.buyCompleteSets);
        var unpacked = utils.unpack(arguments[0], utils.labels(this.buyCompleteSets), arguments);
        tx.params = unpacked.params;
        tx.params[1] = abi.fix(tx.params[1], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    sellCompleteSets: function (market, amount, onSent, onSuccess, onFailed, onConfirmed) {
        var tx = clone(this.tx.CompleteSets.sellCompleteSets);
        var unpacked = utils.unpack(arguments[0], utils.labels(this.sellCompleteSets), arguments);
        tx.params = unpacked.params;
        tx.params[1] = abi.fix(tx.params[1], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    }
};
