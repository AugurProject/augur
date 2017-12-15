"use strict";

var async = require("async");
var ethereumConnector = require("ethereumjs-connect");
var ethrpc = require("ethrpc");
var contracts = require("./contracts");
var api = require("./api");
var rpcInterface = require("./rpc-interface");
var augurNode = require("./augur-node").connect;
var isFunction = require("./utils/is-function");
var isObject = require("./utils/is-object");
var noop = require("./utils/noop");
var DEFAULT_NETWORK_ID = require("./constants").DEFAULT_NETWORK_ID;

/**
 * @param {ethereumNode, augurNode} connectOptions
 * @param callback {function=} Callback function.
 */
function connect(connectOptions, callback) {
  if (!isFunction(callback)) callback = noop;
  if (!isObject(connectOptions)) {
    return callback("Connection info required, e.g. { ethereumNode: { http: 'http://ethereum.node.url', ws: 'ws://ethereum.node.websocket' }, augurNode: 'ws://augur.node.websocket' }");
  }
  var self = this;
  var ethereumNodeConnectOptions = {
    rpc: ethrpc,
    contracts: contracts.addresses,
    startBlockStreamOnConnect: connectOptions.startBlockStreamOnConnect,
    abi: contracts.abi,
    httpAddresses: [],
    wsAddresses: [],
    ipcAddresses: [],
  };
  if (isObject(connectOptions.ethereumNode)) {
    if (connectOptions.ethereumNode.http) {
      ethereumNodeConnectOptions.httpAddresses = [connectOptions.ethereumNode.http];
    } else if (connectOptions.ethereumNode.httpAddresses) {
      ethereumNodeConnectOptions.httpAddresses = connectOptions.ethereumNode.httpAddresses;
    }
    if (connectOptions.ethereumNode.wsAddresses) {
      ethereumNodeConnectOptions.wsAddresses = connectOptions.ethereumNode.wsAddresses;
    } else if (connectOptions.ethereumNode.ws) {
      ethereumNodeConnectOptions.wsAddresses = [connectOptions.ethereumNode.ws];
    }
    if (connectOptions.ethereumNode.ipcAddresses) {
      ethereumNodeConnectOptions.ipcAddresses = connectOptions.ethereumNode.ipcAddresses;
    } else if (connectOptions.ethereumNode.ipc) {
      ethereumNodeConnectOptions.ipcAddresses = [connectOptions.ethereumNode.ipc];
    }
    if (connectOptions.ethereumNode.networkID) {
      ethereumNodeConnectOptions.networkID = connectOptions.ethereumNode.networkID;
    }
  }
  async.parallel({
    augurNode: function (next) {
      console.log("connecting to augur-node:", connectOptions.augurNode);
      if (!connectOptions.augurNode) return next(null);
      augurNode.connect(connectOptions.augurNode, function (err, transport) {
        if (err) {
          console.warn("could not connect to augur-node at", connectOptions.augurNode);
          return next(err);
        }
        transport.addReconnectListener(function() {
          augurNode.emit('reconnect');
        });
        transport.addReconnectListener(function() {
          augurNode.emit('disconnect');
        });
        console.log("connected to augur");
        next(null, connectOptions.augurNode);
      });
    },
    ethereumNode: function (next) {
      console.log("connecting to ethereum-node:", JSON.stringify(connectOptions.ethereumNode));
      if (!connectOptions.ethereumNode) return next(null);
      ethereumConnector.connect(ethereumNodeConnectOptions, function (err, ethereumConnectionInfo) {
        if (err) {
          console.warn("could not connect to ethereum-node at", JSON.stringify(connectOptions.ethereumNode));
          return next(err);
        }
        console.log("connected to ethereum");
        ethereumConnectionInfo.contracts = ethereumConnectionInfo.contracts || contracts.addresses[DEFAULT_NETWORK_ID];
        self.api = api.generateContractApi(ethereumConnectionInfo.abi.functions);
        self.rpc = rpcInterface.createRpcInterface(ethereumConnectionInfo.rpc);
        ethereumConnectionInfo.rpc.getTransport().addReconnectListener(function() {
          rpcInterface.emit('reconnect');
        });
        ethereumConnectionInfo.rpc.getTransport().addDisconnectListener(function() {
          rpcInterface.emit('disconnect');
        });
        next(null, ethereumConnectionInfo);
      });
    },
  }, function (err, connectionInfo) {
    if (err && !connectionInfo.augurNode && !connectionInfo.ethereumNode) return callback(err);
    callback(null, connectionInfo);
  });
}

module.exports = connect;
