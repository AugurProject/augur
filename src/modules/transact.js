/**
 * ethrpc fire/transact wrappers
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

module.exports = {

  fire: function (tx, callback, wrapper, aux) {
    if (this.accounts && this.accounts.account && this.accounts.account.address) {
      tx.from = this.accounts.account.address;
    } else {
      tx.from = tx.from || this.from || this.coinbase;
    }
    return this.rpc.fire(tx, callback, wrapper, aux);
  },

  transact: function (tx, onSent, onSuccess, onFailed) {
    if (this.accounts && this.accounts.account && this.accounts.account.address) {
      tx.from = this.accounts.account.address;
      tx.invocation = {invoke: this.accounts.invoke, context: this.accounts};
    } else {
      tx.from = tx.from || this.from || this.coinbase;
    }
    return this.rpc.transact(tx, onSent, onSuccess, onFailed);
  }
};
