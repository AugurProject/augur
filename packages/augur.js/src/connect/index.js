"use strict";

var assign = require("lodash").assign;
var async = require("async");
var ethrpc = require("ethrpc");
var connectToEthereum = require("./connect-to-ethereum");
var contractsForAllNetworks = require("../contracts");
var api = require("../api");
var events = require("../events");
var rpcInterface = require("../rpc-interface");
// var augurNode = require("../augur-node");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");
var noop = require("../utils/noop");
var constants = require("../constants");

/**
 * @param {ethereumNode, augurNode} connectOptions
 * @param callback {function=} Callback function.
 */
function connect(connectOptions, callback) {
  if (!isFunction(callback)) callback = noop;
  if (!isObject(connectOptions)) {
    return callback(new Error("Connection info required, e.g. { ethereumNode: { http: \"http://ethereum.node.url\", ws: \"ws://ethereum.node.websocket\" }, augurNode: \"ws://augur.node.websocket\" }"));
  }
  var self = this;
  var ethereumNodeConnectOptions = assign({}, connectOptions.ethereumNode || {}, {
    contracts: contractsForAllNetworks.addresses,
    startBlockStreamOnConnect: (connectOptions.ethereumNode || {}).startBlockStreamOnConnect || connectOptions.startBlockStreamOnConnect,
    abi: contractsForAllNetworks.abi,
    httpAddresses: [],
    wsAddresses: [],
    ipcAddresses: [],
    websocketClientConfig: {
      maxReceivedFrameSize: constants.MAX_WEBSOCKET_FRAME_SIZE,
      maxReceivedMessageSize: constants.MAX_WEBSOCKET_FRAME_SIZE,
    },
    propagationDelayWaitMillis: connectOptions.propagationDelayWaitMillis,
    maxRetries: connectOptions.maxRetries,
    useWeb3Transport: connectOptions.useWeb3Transport || false,
  });
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
    if (connectOptions.ethereumNode.networkId) {
      ethereumNodeConnectOptions.networkId = connectOptions.ethereumNode.networkId;
    }
    if (!connectOptions.ethereumNode.connectionTimeout) {
      ethereumNodeConnectOptions.connectionTimeout = constants.DEFAULT_CONNECTION_TIMEOUT;
    }
  }
  async.parallel({
    ethereumNode: function (next) {
      console.log("connecting to ethereum-node:", JSON.stringify(connectOptions.ethereumNode));
      if (!connectOptions.ethereumNode) return next(null);
      connectToEthereum(ethrpc, ethereumNodeConnectOptions, function (err, contracts, functionsAbi, eventsAbi) {
        if (err) {
          console.warn("could not connect to ethereum-node at", JSON.stringify(connectOptions.ethereumNode), err);
          return next(null);
        }
        console.log("connected to ethereum");
        self.api = api.generateContractApi(functionsAbi);
        self.rpc = rpcInterface.createRpcInterface(ethrpc);
        self.getGasPrice = undefined;
        ethrpc.getTransport().addReconnectListener(function () {
          events.nodes.ethereum.emit("reconnect");
        });
        ethrpc.getTransport().addDisconnectListener(function (event) {
          events.nodes.ethereum.emit("disconnect", event);
        });
        next(null, {
          contracts: contracts || contractsForAllNetworks.addresses[constants.DEFAULT_NETWORK_ID],
          abi: { functions: functionsAbi, events: eventsAbi },
        });
      });
    },
  }, function (_, connectionInfo) {
    if (!connectionInfo.augurNode && !connectionInfo.ethereumNode) return callback(new Error("Connection failed"));
    callback(null, connectionInfo);
  });
}

module.exports = connect;
