"use strict";

var assign = require("lodash.assign");
var abi = require("augur-abi");
var rpcInterface = require("../rpc-interface");
var api = require("../api");
var calculateRequiredMarketValue = require("../create/calculate-required-market-value");
var encodeTag = require("../format/tag/encode-tag");

// { uint256 _endTime, uint256 _numOutcomes, uint256 _payoutDenominator, int256 _feePerEthInWei, address _denominationToken, address _creator, int256 _minDisplayPrice, int256 _maxDisplayPrice, address _automatedReporterAddress, int256 _topic }
function createMarket(p) {
  api().ReportingWindow.createNewMarket(assign({}, p, {
    // TODO replace with 'fixed' in abi map
    _minDisplayPrice: abi.fix(p._minDisplayPrice, "hex"),
    _maxDisplayPrice: abi.fix(p._maxDisplayPrice, "hex"),
    _topic: encodeTag(p._topic),
    tx: { value: calculateRequiredMarketValue(rpcInterface.getGasPrice()) }
  }));
}

module.exports = createMarket;
