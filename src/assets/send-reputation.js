"use strict";

var assign = require("lodash").assign;
var speedomatic = require("speedomatic");
var api = require("../api");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.universe The universe of Reputation to use.
 * @param {string} p.reputationToSend Amount of Reputation to send, as a base-10 string.
 * @param {string} p._to Ethereum address of the recipient, as a hexadecimal string.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called if/when the transaction is broadcast to the network.
 * @param {function} p.onSuccess Called if/when the transaction is sealed and confirmed.
 * @param {function} p.onFailed Called if/when the transaction fails.
 */
function sendReputation(p) {
  api().Universe.getReputationToken({ tx: { to: p.universe } }, function (err, reputationTokenAddress) {
    if (err) return p.onFailed(err);
    api().ReputationToken.transfer(assign({}, p, {
      tx: { to: reputationTokenAddress },
      _to: p._to,
      _value: speedomatic.fix(p.reputationToSend, "hex"),
    }));
  });
}

module.exports = sendReputation;
