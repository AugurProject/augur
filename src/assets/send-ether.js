"use strict";

var abi = require("augur-abi");
var isObject = require("../utils/is-object");
var rpcInterface = require("../rpc-interface");

function sendEther(to, value, from, onSent, onSuccess, onFailed) {
  if (isObject(to)) {
    value = to.value;
    from = to.from;
    onSent = to.onSent;
    onSuccess = to.onSuccess;
    onFailed = to.onFailed;
    to = to.to;
  }
  return rpcInterface.transact({
    from: from,
    to: to,
    value: abi.fix(value, "hex"),
    returns: "null",
    gas: "0xcf08"
  }, onSent, onSuccess, onFailed);
}

module.exports = sendEther;
