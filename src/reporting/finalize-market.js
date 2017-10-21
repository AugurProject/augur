"use strict";

var api = require("../api");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.market Address of the market to finalize, as a hex string.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called if/when the transaction is broadcast to the network.
 * @param {function} p.onSuccess Called if/when the transaction is sealed and confirmed.
 * @param {function} p.onFailed Called if/when the transaction fails.
 */
function finalizeMarket(p) {
  api().Market.isFinalized({ tx: { to: p.market } }, function (err, isFinalized) {
    if (err) return p.onFailed(err);
    if (parseInt(isFinalized, 16) === 1) return p.onSuccess(true);
    api().Market.tryFinalize({ tx: { to: p.market, send: false } }, function (err, readyToFinalize) {
      if (err) return p.onFailed(err);
      if (parseInt(readyToFinalize, 16) !== 1) return p.onSuccess(false);
      api().Market.tryFinalize({
        _signer: p._signer,
        tx: { to: p.market },
        onSent: p.onSent,
        onSuccess: p.onSuccess,
        onFailed: p.onFailed
      });
    });
  });
}

module.exports = finalizeMarket;
