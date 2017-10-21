"use strict";

var assign = require("lodash.assign");
var immutableDelete = require("immutable-delete");
var api = require("../api");
var encodeTag = require("../format/tag/encode-tag");
var convertDecimalToFixedPoint = require("../utils/convert-decimal-to-fixed-point");
var DEFAULT_NUM_TICKS = require("../constants").DEFAULT_NUM_TICKS;

/**
 * @param {Object} p Parameters object.
 * @param {string} p.universe Universe on which to create this market.
 * @param {number} p._endTime Market expiration timestamp, in seconds.
 * @param {number} p._numOutcomes Number of outcomes this market has, as an integer on [2, 8].
 * @param {string=} p._feePerEthInWei Amount of wei per ether settled that goes to the market creator, as a base-10 string.
 * @param {string} p._denominationToken Ethereum address of the token used as this market's currency.
 * @param {string} p._creator Ethereum address of the account that is creating this market.
 * @param {string} p._minDisplayPrice Minimum display (non-normalized) price for this market, as a base-10 string.
 * @param {string} p._maxDisplayPrice Maximum display (non-normalized) price for this market, as a base-10 string.
 * @param {string} p._designatedReporterAddress Ethereum address of this market's designated reporter.
 * @param {string} p._topic The topic (category) to which this market belongs, as a UTF8 string.
 * @param {string=} p._numTicks The number of ticks for this market (default: DEFAULT_NUM_TICKS).
 * @param {Object=} p._extraInfo Extra info which will be converted to JSON and logged to the chain in the CreateMarket event.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called if/when the createNewMarket transaction is broadcast to the network.
 * @param {function} p.onSuccess Called if/when the createNewMarket transaction is sealed and confirmed.
 * @param {function} p.onFailed Called if/when the createNewMarket transaction fails.
 */
function createNewMarket(p) {
  api().Universe.getReportingWindowByTimestamp({
    tx: { to: p.universe },
    _timestamp: p._endTime
  }, function (err, reportingWindowAddress) {
    if (err) return p.onFailed(err);
    api().MarketFeeCalculator.getMarketCreationCost({ _reportingWindow: reportingWindowAddress }, function (err, marketCreationCost) {
      if (err) return p.onFailed(err);
      var numTicks = p._numTicks || DEFAULT_NUM_TICKS;
      api().ReportingWindow.createNewMarket(assign({}, immutableDelete(p, "universe"), {
        tx: {
          to: reportingWindowAddress,
          value: marketCreationCost
        },
        _feePerEthInWei: p._feePerEthInWei,
        _numTicks: numTicks,
        _minDisplayPrice: convertDecimalToFixedPoint(p._minDisplayPrice, numTicks),
        _maxDisplayPrice: convertDecimalToFixedPoint(p._maxDisplayPrice, numTicks),
        _topic: encodeTag(p._topic),
        _extraInfo: p._extraInfo ? JSON.stringify(p._extraInfo) : ""
      }));
    });
  });
}

module.exports = createNewMarket;
