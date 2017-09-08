"use strict";

var assign = require("lodash.assign");
var speedomatic = require("speedomatic");
var api = require("../api");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.branchID The branch of Reputation to use.
 * @param {string} p.reputationToSend Amount of Reputation to send, as a base-10 string.
 * @param {string} p._to Ethereum address of the recipient, as a hexadecimal string.
 * @param {buffer|function=} p._signer Can be the plaintext private key as a Buffer or the signing function to use.
 * @param {function} p.onSent Called if/when the transaction is broadcast to the network.
 * @param {function} p.onSuccess Called if/when the transaction is sealed and confirmed.
 * @param {function} p.onFailed Called if/when the transaction fails.
 */
function sendReputation(p) {
  api().Branch.getReputationToken({ tx: { to: p.branchID } }, function (reputationTokenAddress) {
    if (!reputationTokenAddress) return p.onFailed("Reputation token address not found for branch " + p.branchID);
    if (reputationTokenAddress.error) return p.onFailed(reputationTokenAddress);
    api().ReputationToken.transfer(assign({}, p, {
      tx: { to: reputationTokenAddress },
      _to: p._to,
      _value: speedomatic.fix(p.reputationToSend, "hex")
    }));
  });
}

module.exports = sendReputation;
