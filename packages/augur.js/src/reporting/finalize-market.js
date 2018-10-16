"use strict";

var assign = require("lodash").assign;
var immutableDelete = require("immutable-delete");
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
  var marketPayload = { tx: { to: p.market } };
  api().Market.isFinalized(marketPayload, function (err, isFinalized) {
    if (err) return p.onFailed(err);
    if (parseInt(isFinalized, 16) === 1) return p.onSuccess(true);
    api().Market.finalize(assign({}, marketPayload, { tx: assign({}, marketPayload.tx, { send: false }) }), function (err, readyToFinalize) {
      if (err) return p.onFailed(err);
      if (readyToFinalize !== true) return p.onSuccess(false);
      api().Market.finalize(assign({}, immutableDelete(p, "market"), marketPayload));
    });
  });
}

module.exports = finalizeMarket;
