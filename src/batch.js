/**
 * Batch interface:
 * var b = augur.createBatch();
 * b.add("getCashBalance", [augur.coinbase], callback);
 * b.add("getRepBalance", [augur.branches.dev, augur.coinbase], callback);
 * b.execute();
 */

"use strict";

var clone = require("clone");

var Batch = function (tx, rpc) {
    this.tx = tx;
    this.rpc = rpc;
    this.txlist = [];
};

Batch.prototype.add = function (method, params, callback) {
    if (method) {
        var tx = clone(this.tx[method]);
        tx.params = params;
        if (callback) tx.callback = callback;
        this.txlist.push(tx);
    }
};

Batch.prototype.execute = function () {
    this.rpc.batch(this.txlist, true);
};

module.exports = function () {
    return new Batch(this.tx, this.rpc);
};
