"use strict";

var setContracts = require("./set-contracts");
var setFrom = require("./set-from");
var setupEventsAbi = require("./setup-events-abi");
var setupFunctionsAbi = require("./setup-functions-abi");
var createEthrpcConfiguration = require("./create-ethrpc-configuration");
var createConfiguration = require("./create-configuration");
var isFunction = require("../utils/is-function");
var noop = require("../utils/noop");

function connectToEthereum(ethrpc, options, callback) {
  if (!isFunction(callback)) callback = noop;
  var configuration = createConfiguration(options || {});
  ethrpc.connect(createEthrpcConfiguration(configuration), function (err) {
    if (err) return callback(err);
    var contracts = setContracts(ethrpc.getNetworkID(), configuration.contracts);
    var eventsAbi = setupEventsAbi((configuration.abi || {}).events, contracts);
    var functionsAbi = setupFunctionsAbi(setFrom((configuration.abi || {}).functions, ethrpc.getCoinbase()), contracts);
    callback(null, contracts, functionsAbi, eventsAbi);
  });
}

module.exports = connectToEthereum;
