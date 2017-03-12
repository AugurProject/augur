/**
 * Augur JavaScript SDK
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var abi = require("augur-abi");

module.exports = {

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
