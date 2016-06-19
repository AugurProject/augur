/**
 * Testing-only: these methods are whitelisted on production contracts!
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");

module.exports = {

    setInfo: function (id, description, creator, fee, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.setInfo);
        var unpacked = utils.unpack(id, utils.labels(this.setInfo), arguments);
        tx.params = unpacked.params;
        tx.params[3] = abi.fix(tx.params[3], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    modifyShares: function (marketID, outcome, amount, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.modifyShares);
        var unpacked = utils.unpack(marketID, utils.labels(this.modifyShares), arguments);
        tx.params = unpacked.params;
        tx.params[2] = abi.fix(tx.params[2], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    incrementPeriod: function (branchId, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.incrementPeriod);
        var unpacked = utils.unpack(branchId, utils.labels(this.incrementPeriod), arguments);
        tx.params = unpacked.params;
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    addMarket: function (branchId, marketID, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.addMarket);
        var unpacked = utils.unpack(branchId, utils.labels(this.addMarket), arguments);
        tx.params = unpacked.params;
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    addEvent: function (branchId, futurePeriod, eventID, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.addEvent);
        var unpacked = utils.unpack(branchId, utils.labels(this.addEvent), arguments);
        tx.params = unpacked.params;
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    setTotalRepReported: function (branchId, reportPeriod, repReported, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.setTotalRepReported);
        var unpacked = utils.unpack(branchId, utils.labels(this.setTotalRepReported), arguments);
        tx.params = unpacked.params;
        tx.params[2] = abi.fix(tx.params[2], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    }
};
