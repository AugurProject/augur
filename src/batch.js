/**
 * Batch interface:
 * var b = augur.createBatch();
 * b.add("getCashBalance", [augur.coinbase], callback);
 * b.add("getRepBalance", [augur.constants.DEFAULT_BRANCH_ID, augur.coinbase], callback);
 * b.execute();
 */

"use strict";

var clone = require("clone");

var Batch = function (tx, rpc) {
  this.tx = tx;
  this.rpc = rpc;
  this.txlist = [];
};

Batch.prototype.add = function (contract, method, params, callback) {
  if (method && contract) {
    var tx = clone(this.tx[contract][method]);
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
