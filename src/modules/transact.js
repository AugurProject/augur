/**
 * ethrpc fire/transact wrappers
 */

"use strict";

var store = require("../store");

module.exports = {

  fire: function (tx, callback, wrapper, aux) {
    var activeAccount = store.getState().activeAccount;
    if (activeAccount && activeAccount.address) {
      tx.from = activeAccount.address;
    } else {
      tx.from = tx.from || store.getState().fromAddress || store.getState().coinbaseAddress;
    }
    return this.rpc.fire(tx, callback, wrapper, aux);
  },

  transact: function (tx, onSent, onSuccess, onFailed) {
    var self = this;
    var activeAccount = store.getState().activeAccount;
    if (activeAccount && activeAccount.address && activeAccount.privateKey) {
      tx.from = activeAccount.address;
      tx.invoke = function (payload, onSent, onSuccess, onFailed) {
        return self.rpc.packageAndSubmitRawTransaction(payload, activeAccount.address, activeAccount.privateKey, onSent, onSuccess, onFailed);
      };
    } else {
      tx.from = tx.from || store.getState().fromAddress || store.getState().coinbaseAddress;
    }
    return this.rpc.transact(tx, onSent, onSuccess, onFailed);
  }
};
