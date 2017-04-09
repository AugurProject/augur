/**
 * ethrpc fire/transact wrappers
 */

"use strict";

var store = require("../store");

module.exports = {

  fire: function (tx, callback, wrapper, aux) {
    var state = store.getState();
    var activeAccount = state.activeAccount;
    if (activeAccount && activeAccount.address) {
      tx.from = activeAccount.address;
    } else {
      tx.from = tx.from || state.fromAddress || state.coinbaseAddress;
    }
    return this.rpc.fire(tx, callback, wrapper, aux);
  },

  transact: function (tx, onSent, onSuccess, onFailed) {
    var self = this;
    var state = store.getState();
    var activeAccount = state.activeAccount;
    if (activeAccount && activeAccount.address && activeAccount.privateKey) {
      tx.from = activeAccount.address;
      tx.invoke = function (payload, onSent, onSuccess, onFailed) {
        return self.rpc.packageAndSubmitRawTransaction(payload, activeAccount.address, activeAccount.privateKey, onSent, onSuccess, onFailed);
      };
    } else {
      tx.from = tx.from || state.fromAddress || state.coinbaseAddress;
    }
    return this.rpc.transact(tx, onSent, onSuccess, onFailed);
  }
};
