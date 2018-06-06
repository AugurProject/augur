"use strict";

var chalk = require("chalk");
var immutableDelete = require("immutable-delete");
var printTransactionStatus = require("./print-transaction-status");
var speedomatic = require("speedomatic");
var debugOptions = require("../../debug-options");

function createMarket(augur, market, designatedReporterAddress, auth, callback) {
  var createMarketOfType;
  switch (market.marketType) {
    case "categorical":
      createMarketOfType = augur.createMarket.createCategoricalMarket;
      break;
    case "scalar":
      createMarketOfType = augur.createMarket.createScalarMarket;
      break;
    case "yesNo":
    default:
      createMarketOfType = augur.createMarket.createYesNoMarket;
  }
  var createMarketParams = Object.assign({}, immutableDelete(market, ["orderBook", "marketType"]), {
    meta: auth,
    universe: augur.contracts.addresses[augur.rpc.getNetworkID()].Universe,
    _feePerEthInWei: speedomatic.fix(0.01, "hex"),
    _denominationToken: augur.contracts.addresses[augur.rpc.getNetworkID()].Cash,
    _designatedReporterAddress: designatedReporterAddress,
    onSent: function (res) {
      if (debugOptions.cannedMarkets) console.log(chalk.green.dim("createMarket sent:"), chalk.green(res.hash));
    },
    onSuccess: function (res) {
      if (debugOptions.cannedMarkets) {
        console.log(chalk.green.dim("createMarket success:"), chalk.green(res.callReturn));
        printTransactionStatus(augur.rpc, res.hash);
      }
      callback(null, res.callReturn);
    },
    onFailed: function (err) {
      if (debugOptions.cannedMarkets) {
        console.error(chalk.red.bold("createMarket failed:"), err, market);
        if (err != null) printTransactionStatus(augur.rpc, err.hash);
      }
      callback(err);
    },
  });
  if (debugOptions.cannedMarkets) console.log("createMarket params:", createMarketParams);
  createMarketOfType(createMarketParams);
}

module.exports = createMarket;
