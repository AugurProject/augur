/**
 * Testing-only: these methods are whitelisted on production contracts!
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");

module.exports = {

    setInfo: function (id, description, creator, fee, onSent, onSuccess, onFailed, onConfirmed) {
        var tx = clone(this.tx.Info.setInfo);
        var unpacked = utils.unpack(id, utils.labels(this.setInfo), arguments);
        tx.params = unpacked.params;
        tx.params[3] = abi.fix(tx.params[3], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    modifyShares: function (marketID, outcome, amount, onSent, onSuccess, onFailed, onConfirmed) {
        var tx = clone(this.tx.Markets.modifyShares);
        var unpacked = utils.unpack(marketID, utils.labels(this.modifyShares), arguments);
        tx.params = unpacked.params;
        tx.params[2] = abi.fix(tx.params[2], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    },

    setTotalRepReported: function (branchId, reportPeriod, repReported, onSent, onSuccess, onFailed, onConfirmed) {
        var tx = clone(this.tx.ExpiringEvents.setTotalRepReported);
        var unpacked = utils.unpack(branchId, utils.labels(this.setTotalRepReported), arguments);
        tx.params = unpacked.params;
        tx.params[2] = abi.fix(tx.params[2], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    }
};
