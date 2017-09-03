"use strict";

var speedomatic = require("speedomatic");
var rpcInterface = require("../rpc-interface");

// { to, value, from, onSent, onSuccess, onFailed }
function sendEther(p) {
  return rpcInterface.transact({
    from: p.from,
    to: p.to,
    value: speedomatic.fix(p.value, "hex"),
    returns: "null",
    gas: "0xcf08"
  }, p.signer, p.onSent, p.onSuccess, p.onFailed);
}

module.exports = sendEther;
