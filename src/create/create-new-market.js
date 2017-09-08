"use strict";

var assign = require("lodash.assign");
var speedomatic = require("speedomatic");
var api = require("../api");
var rpcInterface = require("../rpc-interface");
var calculateRequiredMarketValue = require("../create/calculate-required-market-value");
var encodeTag = require("../format/tag/encode-tag");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.branchID Branch on which to create this market.
 * @param {number} p._endTime Market expiration timestamp, in seconds.
 * @param {number} p._numOutcomes Number of outcomes this market has, as an integer on [2, 8].
 * @param {string} p._payoutDenominator Reports are the relative amounts to pay out to holders of shares of each outcome.  Payout denominator is used to round off the reported values, i.e. it determines the outcome resolution "tick size".  It should be set to the number of outcomes for non-scalar markets; for scalar markets, it must be a multiple of 2.  Must be a base-10 string.
 * @param {string} p._feePerEthInWei Fee that goes to the market creator, as a base-10 string.
 * @param {string} p._denominationToken Ethereum address of the token used as this market's currency.
 * @param {string} p._creator Ethereum address of the account that is creating this market.
 * @param {string} p._minDisplayPrice Minimum display (non-normalized) price for this market, as a base-10 string.
 * @param {string} p._maxDisplayPrice Maximum display (non-normalized) price for this market, as a base-10 string.
 * @param {string} p._automatedReporterAddress Ethereum address of this market's automated reporter.
 * @param {string} p._topic The topic (category) to which this market belongs, as a UTF8 string.
 * @param {Object=} p._extraInfo Extra info which will be converted to JSON and logged to the chain in the CreateMarket event.
 * @param {buffer|function=} p._signer Can be the plaintext private key as a Buffer or the signing function to use.
 * @param {function} p.onSent Called if/when the createNewMarket transaction is broadcast to the network.
 * @param {function} p.onSuccess Called if/when the createNewMarket transaction is sealed and confirmed.
 * @param {function} p.onFailed Called if/when the createNewMarket transaction fails.
 */
function createNewMarket(p) {
  api().Branch.getReportingWindowByTimestamp({
    tx: { to: p.branchID },
    _timestamp: p._endTime
  }, function (reportingWindowAddress) {
    if (!reportingWindowAddress) return p.onFailed("Reporting window address not found");
    if (reportingWindowAddress.error) return p.onFailed(reportingWindowAddress);
    api().ReportingWindow.createNewMarket(assign({}, p, {
      tx: {
        to: reportingWindowAddress,
        value: calculateRequiredMarketValue(rpcInterface.getGasPrice())
      },
      // TODO replace with 'fixed' in abi map
      _minDisplayPrice: speedomatic.fix(p._minDisplayPrice, "hex"),
      _maxDisplayPrice: speedomatic.fix(p._maxDisplayPrice, "hex"),
      _topic: encodeTag(p._topic),
      _extraInfo: p._extraInfo ? JSON.stringify(p._extraInfo) : ""
    }));
  });
}

module.exports = createNewMarket;
