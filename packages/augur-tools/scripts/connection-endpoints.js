"use strict";

var augurNode = process.env.AUGUR_WS || "ws://127.0.0.1:9001";
var ethereumNode = {
  http: process.env.ETHEREUM_HTTP || "http://127.0.0.1:8545",
  pollingIntervalMilliseconds: 500,
  blockRetention: 100,
  connectionTimeout: 60000,
};
if (process.env.ETHEREUM_WS != null) ethereumNode.ws = process.env.ETHEREUM_WS;
if (process.env.ETHEREUM_IPC != null) ethereumNode.ipc = process.env.ETHEREUM_IPC;

module.exports.augurNode = augurNode;
module.exports.ethereumNode = ethereumNode;
