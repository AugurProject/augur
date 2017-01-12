/**
 * ethrpc fire/transact wrappers
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

module.exports = {

  fire: function (tx, callback, wrapper, aux) {
    if (this.web && this.web.account && this.web.account.address) {
      tx.from = this.web.account.address;
    } else {
      tx.from = tx.from || this.from || this.coinbase;
    }
    return this.rpc.fire(tx, callback, wrapper, aux);
  },

  transact: function (tx, onSent, onSuccess, onFailed) {
    if (this.web && this.web.account && this.web.account.address) {
      tx.from = this.web.account.address;
      tx.invocation = {invoke: this.web.invoke, context: this.web};
    } else {
      tx.from = tx.from || this.from || this.coinbase;
    }
    return this.rpc.transact(tx, onSent, onSuccess, onFailed);
  }
};
