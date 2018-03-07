"use strict";

// var rpc = require("ethrpc");
var setContracts = require("./set-contracts");
var setFrom = require("./set-from");
var setupEventsAbi = require("./setup-events-abi");
var setupFunctionsAbi = require("./setup-functions-abi");
var createEthrpcConfiguration = require("./create-ethrpc-configuration");
var createConfiguration = require("./create-configuration");
var isFunction = require("../utils/is-function");
var noop = require("../utils/noop");

function connect(ethrpc, options, callback) {
  if (!isFunction(callback)) callback = noop;
  var configuration = createConfiguration(options || {});
  ethrpc.connect(createEthrpcConfiguration(configuration), function (err) {
    if (err) return callback(err);
    var networkID = rpc.getNetworkID();
    var coinbase = rpc.getCoinbase();
    var vitals = {};
    vitals.contracts = setContracts(vitals.networkID, configuration.contracts);
    vitals.abi = {};
    var eventsAbi = setupEventsAbi((configuration.abi || {}).events, vitals.contracts);
    var functionsAbi = setupFunctionsAbi(setFrom((configuration.abi || {}).functions, vitals.coinbase), vitals.contracts);
    if (eventsAbi) vitals.abi.events = eventsAbi;
    if (functionsAbi) vitals.abi.functions = functionsAbi;
    callback(null, vitals);
  });
  // asyncConnect(configuration.rpc || rpc, configuration, function (err, vitals) {
  //   vitals.rpc = configuration.rpc || rpc;
  //   callback(err, vitals);
  // });
}

module.exports = connect;
