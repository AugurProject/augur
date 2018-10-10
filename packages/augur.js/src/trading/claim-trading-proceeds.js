"use strict";

var api = require("../api");

/**
 * @param {Object} p Parameters object.
 * @param {string} p._market Market address for which to claim proceeds.
 * @param {string} p._shareHolder User address that holds the shares.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called if/when each transaction is broadcast to the network.
 * @param {function} p.onSuccess Called if/when all transactions are sealed and confirmed.
 * @param {function} p.onFailed Called if/when any of the transactions fail.
 */
function claimTradingProceeds(p) {
  api().Market.getFinalizationTime({ tx: { to: p._market } }, function (err, finalizationTime) {
    if (err) return p.onFailed(err);
    if (parseInt(finalizationTime, 16) === 0) return p.onFailed(null); // market not yet finalized
    api().ClaimTradingProceeds.claimTradingProceeds(p);
  });
}

module.exports = claimTradingProceeds;
