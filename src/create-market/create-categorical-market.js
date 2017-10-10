"use strict";

var assign = require("lodash.assign");
var getMarketCreationCost = require("./get-market-creation-cost");
var api = require("../api");
var encodeTag = require("../format/tag/encode-tag");

/**
 * @param {Object} p Parameters object.
 * @param {string} p._branch Branch on which to create this market.
 * @param {number} p._endTime Market expiration timestamp, in seconds.
 * @param {number} p._numOutcomes Number of outcomes this market has, as an integer on [2, 8].
 * @param {string} p._feePerEthInWei Fee that goes to the market creator, as a hexadecimal string.
 * @param {string} p._denominationToken Ethereum address of the token used as this market's currency.
 * @param {string} p._automatedReporterAddress Ethereum address of this market's automated reporter.
 * @param {string} p._topic The topic (category) to which this market belongs, as a UTF8 string.
 * @param {number=} p._numTicks The number of ticks for this market (default: p._numOutcomes).
 * @param {Object=} p._extraInfo Extra info which will be converted to JSON and logged to the chain in the CreateMarket event.
 * @param {buffer|function=} p._signer Can be the plaintext private key as a Buffer or the signing function to use.
 * @param {function} p.onSent Called if/when the transaction is broadcast to the network.
 * @param {function} p.onSuccess Called if/when the transaction is sealed and confirmed.
 * @param {function} p.onFailed Called if/when the transaction fails.
 */
function createCategoricalMarket(p) {
  getMarketCreationCost({ branchID: p._branch, _endTime: p._endTime }, function (err, marketCreationCost) {
    if (err) return p.onFailed(err);
    api().MarketCreation.createCategoricalMarket(assign({}, p, {
      tx: { value: marketCreationCost },
      _numTicks: p._numTicks || p._numOutcomes,
      _topic: encodeTag(p._topic),
      _extraInfo: p._extraInfo ? JSON.stringify(p._extraInfo) : ""
    }));
  });
}

module.exports = createCategoricalMarket;
