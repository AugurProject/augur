"use strict";

var EventEmitter = require("event-emitter");

module.exports = {
  hashEventAbi: require("./hash-event-abi"),
  getAllAugurLogs: require("./get-all-augur-logs"),
  startAugurNodeEventListeners: require("./start-augur-node-event-listeners"),
  stopAugurNodeEventListeners: require("./stop-augur-node-event-listeners"),
  startBlockchainEventListeners: require("./start-blockchain-event-listeners"),
  stopBlockchainEventListeners: require("./stop-blockchain-event-listeners"),
  startBlockListeners: require("./start-block-listeners"),
  stopBlockListeners: require("./stop-block-listeners"),
  nodes: {
    augur: EventEmitter(),
    ethereum: EventEmitter(),
  },
};
