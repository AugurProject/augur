"use strict";

var assign = require("lodash.assign");
var BigNumber = require("bignumber.js");
var immutableDelete = require("immutable-delete");
var api = require("../api");
var ZERO = require("../constants").ZERO;

/**
 * Current reporting window does not exist yet, so create it.
 * @param {Object} p Parameters object.
 * @param {string} p.universe Universe on which to create this market.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called if/when the getOrCacheMarketCreationCost transaction is broadcast to the network.
 * @param {function} p.onSuccess Called if/when the getOrCacheMarketCreationCost transaction is sealed and confirmed.
 * @param {function} p.onFailed Called if/when the getOrCacheMarketCreationCost transaction fails.
 */
function createCurrentReportingWindow(p) {
  api().Universe.getOrCacheMarketCreationCost(assign({}, immutableDelete(p, "universe"), {
    tx: { to: p.universe },
    onSuccess: function (res) {
      // If we've stepped into an even newer reporting window, create that one too
      if (new BigNumber(res.callReturn, 10).eq(ZERO)) return createCurrentReportingWindow(p);
      p.onSuccess(res);
    },
  }));
}

module.exports = createCurrentReportingWindow;
