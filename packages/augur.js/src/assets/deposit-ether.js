"use strict";

var assign = require("lodash").assign;
var speedomatic = require("speedomatic");
var api = require("../api");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.etherToDeposit Amount of Ether to convert to "wrapped Ether" (AKA Ether tokens), as a base-10 string.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called if/when the transaction is broadcast to the network.
 * @param {function} p.onSuccess Called if/when the transaction is sealed and confirmed.
 * @param {function} p.onFailed Called if/when the transaction fails.
 */
function depositEther(p) {
  return api().Cash.depositEther(assign({}, p, {
    tx: assign({ value: speedomatic.fix(p.etherToDeposit, "hex") }, p.tx),
  }));
}

module.exports = depositEther;
