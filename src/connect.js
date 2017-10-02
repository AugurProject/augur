"use strict";

var connector = require("ethereumjs-connect");
var ethrpc = require("ethrpc");
var contracts = require("./contracts");
var api = require("./api");
var rpcInterface = require("./rpc-interface");
var isFunction = require("./utils/is-function");
var isObject = require("./utils/is-object");
var DEFAULT_NETWORK_ID = require("./constants").DEFAULT_NETWORK_ID;

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
      contracts: contracts.addresses,
      abi: contracts.abi,
      httpAddresses: [],
      wsAddresses: [],
      ipcAddresses: []
    };
  if (isObject(connectOptions)) {
    if (connectOptions.httpAddresses) options.httpAddresses = connectOptions.httpAddresses;
    if (connectOptions.wsAddresses) options.wsAddresses = connectOptions.wsAddresses;
    if (connectOptions.ipcAddresses) options.ipcAddresses = connectOptions.ipcAddresses;
    if (connectOptions.http) options.httpAddresses.push(connectOptions.http);
    if (connectOptions.ws) options.wsAddresses.push(connectOptions.ws);
    if (connectOptions.ipc) options.ipcAddresses.push(connectOptions.ipc);
    if (connectOptions.networkID) options.networkID = connectOptions.networkID;
  }
  if (!isFunction(callback)) {
    vitals = connector.connect(options);
    if (vitals instanceof Error) throw vitals;
    vitals.contracts = vitals.contracts || contracts.addresses[DEFAULT_NETWORK_ID];
    this.api = api.generateContractApi(vitals.abi.functions);
    rpcInterface.createRpcInterface(vitals.rpc);
    return vitals;
  }
  connector.connect(options, function (err, vitals) {
    if (err) return callback(err);
    vitals.contracts = vitals.contracts || contracts.addresses[DEFAULT_NETWORK_ID];
    this.api = api.generateContractApi(vitals.abi.functions);
    this.rpc = rpcInterface.createRpcInterface(vitals.rpc);
    callback(vitals);
  }.bind(this));
}

module.exports = connect;
