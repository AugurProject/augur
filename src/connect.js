"use strict";

var connector = require("ethereumjs-connect");
var augurContracts = require("augur-contracts");
var ethrpc = require("ethrpc");
var api = require("../api");
var rpcInterface = require("../rpc-interface");
var isFunction = require("../utils/is-function");
var DEFAULT_NETWORK_ID = require("../constants").DEFAULT_NETWORK_ID;

/**
 * @param connectOptions {Object|string=} Two forms accepted:
 *    1. Object with connection info fields:
 *       { http: "https://eth3.augur.net",
 *         ipc: "/path/to/geth.ipc",
 *         ws: "wss://ws.augur.net" }
 *    2. URL string for HTTP RPC: "https://eth3.augur.net"
 * @param callback {function=} Callback function.
 */
function connect(connectOptions, callback) {
  var vitals, options = {
    rpc: ethrpc,
    contracts: augurContracts,
    api: augurContracts.api,
    httpAddresses: [],
    wsAddresses: [],
    ipcAddresses: []
  };
  if (connectOptions) {
    switch (connectOptions.constructor) {
      case String:
        options.httpAddresses.push(connectOptions);
        break;
      case Function:
        callback = connectOptions;
        break;
      case Object:
        if (connectOptions.httpAddresses) options.httpAddresses = connectOptions.httpAddresses;
        if (connectOptions.wsAddresses) options.wsAddresses = connectOptions.wsAddresses;
        if (connectOptions.ipcAddresses) options.ipcAddresses = connectOptions.ipcAddresses;
        if (connectOptions.http) options.httpAddresses.push(connectOptions.http);
        if (connectOptions.ws) options.wsAddresses.push(connectOptions.ws);
        if (connectOptions.ipc) options.ipcAddresses.push(connectOptions.ipc);
        options.contracts = augurContracts;
        options.api = augurContracts.api;
        break;
      default:
        break;
    }
  }
  if (!isFunction(callback)) {
    vitals = connector.connect(options);
    if (vitals instanceof Error) return vitals;
    vitals.contracts = vitals.contracts || augurContracts[DEFAULT_NETWORK_ID];
    vitals.api = (vitals.api && vitals.api.functions) ? vitals.api : augurContracts.api;
    api.generateContractAPI(vitals.api.functions);
    rpcInterface.createRpcInterface(vitals.rpc);
    return vitals;
  }
  connector.connect(options, function (err, vitals) {
    if (err) return callback(err);
    vitals.contracts = vitals.contracts || augurContracts[DEFAULT_NETWORK_ID];
    vitals.api = (vitals.api && vitals.api.functions) ? vitals.api : augurContracts.api;
    api.generateContractAPI(vitals.api.functions);
    rpcInterface.createRpcInterface(vitals.rpc);
    callback(vitals);
  });
}

module.exports = connect;
