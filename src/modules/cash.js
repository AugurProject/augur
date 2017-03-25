/**
 * Augur JavaScript SDK
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var abi = require("augur-abi");
var clone = require("clone");

module.exports = {

  depositEther: function (value, onSent, onSuccess, onFailed) {
    var tx;
    if (value && value.constructor === Object) {
      onSent = value.onSent;
      onSuccess = value.onSuccess;
      onFailed = value.onFailed;
      value = value.value;
    }
    tx = clone(this.api.functions.Cash.depositEther);
    tx.value = abi.fix(value, "hex");
    return this.transact(tx, onSent, onSuccess, onFailed);
  },

  sendEther: function (to, value, from, onSent, onSuccess, onFailed) {
    if (to && to.constructor === Object) {
      value = to.value;
      from = to.from;
      onSent = to.onSent;
      onSuccess = to.onSuccess;
      onFailed = to.onFailed;
      to = to.to;
    }
    return this.transact({
      from: from,
      to: to,
      value: abi.fix(value, "hex"),
      returns: "null",
      gas: "0xcf08"
    }, onSent, onSuccess, onFailed);
  }

};
