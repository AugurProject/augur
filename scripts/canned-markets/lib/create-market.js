"use strict";

var chalk = require("chalk");
var immutableDelete = require("immutable-delete");
var debugOptions = require("../../debug-options");

function createMarket(augur, market, callback) {
  var createMarketOfType;
  switch (market._extraInfo.marketType) {
    case "categorical":
      createMarketOfType = augur.createMarket.createCategoricalMarket;
      break;
    case "scalar":
      createMarketOfType = augur.createMarket.createScalarMarket;
      break;
    case "binary":
    default:
      createMarketOfType = augur.createMarket.createBinaryMarket;
  }
  var createMarketParams = Object.assign({}, immutableDelete(market, ["orderBook", "marketType"]), {
    universe: augur.contracts.addresses[augur.rpc.getNetworkID()].Universe,
    _feePerEthInWei: "0x123456",
    _denominationToken: augur.contracts.addresses[augur.rpc.getNetworkID()].Cash,
    _designatedReporterAddress: augur.rpc.getCoinbase(),
    onSent: function (res) {
      if (debugOptions.cannedMarkets) console.log("createMarket sent:", res.hash);
    },
    onSuccess: function (res) {
      if (debugOptions.cannedMarkets) console.log("createMarket success:", res.callReturn);
      callback(null, res.callReturn);
    },
    onFailed: function (err) {
      if (debugOptions.cannedMarkets) console.error(chalk.red.bold("createMarket failed:"), err);
      callback(err);
    },
  });
  if (debugOptions.cannedMarkets) console.log("createMarket params:", createMarketParams);
  createMarketOfType(createMarketParams);
}

module.exports = createMarket;
