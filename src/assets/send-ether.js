"use strict";

var speedomatic = require("speedomatic");
var ethrpc = require("../rpc-interface");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.etherToSend Amount of Ether to send, as a base-10 string.
 * @param {string} p.to Ethereum address of the recipient, as a hexadecimal string.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called if/when the transaction is broadcast to the network.
 * @param {function} p.onSuccess Called if/when the transaction is sealed and confirmed.
 * @param {function} p.onFailed Called if/when the transaction fails.
 */
function sendEther(p) {
  return ethrpc.transact({
    from: p.from,
    to: p.to,
    value: speedomatic.fix(p.etherToSend, "hex"),
    returns: "null",
    gas: "0xcf08",
  }, p.meta.signer, p.meta.accountType, p.onSent, p.onSuccess, p.onFailed);
}

module.exports = sendEther;
