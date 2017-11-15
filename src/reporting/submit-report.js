"use strict";

var assign = require("lodash.assign");
var immutableDelete = require("immutable-delete");
var speedomatic = require("speedomatic");
var api = require("../api");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.market Address of the market to finalize, as a hex string.
 * @param {string[]} p._payoutNumerators Relative payout amounts to traders holding shares of each outcome, as an array of base-10 strings.
 * @param {string} p._amountToStake Amount of Reporting tokens to stake on this report, as a base-10 string.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called if/when the transaction is broadcast to the network.
 * @param {function} p.onSuccess Called if/when the transaction is sealed and confirmed.
 * @param {function} p.onFailed Called if/when the transaction fails.
 */
function submitReport(p) {
  api().Market.getStakeToken({
    tx: { to: p.market },
    _payoutNumerators: p._payoutNumerators,
  }, function (err, stakeTokenAddress) {
    if (err) return p.onFailed(err);
    api().StakeToken.buy(assign({}, immutableDelete(p, "market"), {
      tx: { to: stakeTokenAddress },
      _amountToStake: speedomatic.fix(p._amountToStake, "hex"),
    }));
  });
}

module.exports = submitReport;
