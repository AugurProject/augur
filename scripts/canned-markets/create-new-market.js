"use strict";

var chalk = require("chalk");
var immutableDelete = require("immutable-delete");
var DEBUG = require("./debug-options").cannedMarkets;

function createNewMarket(augur, market, callback) {
  var createMarket;
  switch (market._extraInfo.marketType) {
    case "categorical":
      createMarket = augur.createMarket.createCategoricalMarket;
      break;
    case "scalar":
      createMarket = augur.createMarket.createScalarMarket;
      break;
    case "binary":
    default:
      createMarket = augur.createMarket.createBinaryMarket;
  }
  var createMarketParams = Object.assign({}, immutableDelete(market, ["orderBook", "marketType"]), {
    universe: augur.contracts.addresses[augur.rpc.getNetworkID()].Universe,
    _feePerEthInWei: "0x123456",
    _denominationToken: augur.contracts.addresses[augur.rpc.getNetworkID()].Cash,
    _designatedReporterAddress: augur.rpc.getCoinbase(),
    onSent: function (res) {
      if (DEBUG) console.log("createMarket sent:", res.hash);
    },
    onSuccess: function (res) {
      if (DEBUG) console.log("createMarket success:", res.callReturn);
      callback(null, res.callReturn);
    },
    onFailed: function (err) {
      if (DEBUG) console.error(chalk.red.bold("createMarket failed:"), err);
      callback(err);
    },
  });
  if (DEBUG) console.log("createMarket params:", createMarketParams);
  createMarket(createMarketParams);
}

module.exports = createNewMarket;
