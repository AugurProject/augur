"use strict";

var abi = require("augur-abi");
var isObject = require("../utils/is-object");
var rpcInterface = require("../rpc-interface");

// { to, value, from, onSent, onSuccess, onFailed }
function sendEther(p) {
  return rpcInterface.transact({
    from: p.from,
    to: p.to,
    value: abi.fix(p.value, "hex"),
    returns: "null",
    gas: "0xcf08"
  }, p.signer, p.onSent, p.onSuccess, p.onFailed);
}

module.exports = sendEther;
