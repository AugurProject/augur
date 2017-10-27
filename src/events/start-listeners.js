"use strict";

var addFilter = require("./add-filter");
var parseBlockMessage = require("./parse-message/parse-block-message");
var subscriptions = require("./subscriptions");
var contracts = require("../contracts");
var ethrpc = require("../rpc-interface");
var isFunction = require("../utils/is-function");

/**
 * Start listening for events emitted by the Ethereum blockchain.
 * @param {Object.<function>=} onEventCallbacks Callbacks to fire when events are received, keyed by contract name and event name.
 * @param {function=} onBlockAdded Callback to fire when new blocks are received.
 * @param {function=} onBlockRemoved Callback to fire when blocks are removed.
 * @param {function=} onSetupComplete Called when all listeners are successfully set up.
 */
function startListeners(onEventCallbacks, onBlockAdded, onBlockRemoved, onSetupComplete) {
  var blockStream = ethrpc.getBlockStream();
  if (!blockStream) return console.error("Not connected");
  if (isFunction(onBlockAdded)) {
    blockStream.subscribeToOnBlockAdded(function (newBlock) {
      parseBlockMessage(newBlock, onBlockAdded);
    });
  }
  if (isFunction(onBlockRemoved)) {
    blockStream.subscribeToOnBlockRemoved(function (removedBlock) {
      parseBlockMessage(removedBlock, onBlockRemoved);
    });
  }
  if (onEventCallbacks != null) {
    var eventsAbi = contracts.abi.events;
    var activeContracts = contracts.addresses[ethrpc.getNetworkID()];
    Object.keys(onEventCallbacks).forEach(function (contractName) {
      Object.keys(onEventCallbacks[contractName]).forEach(function (eventName) {
        if (isFunction(onEventCallbacks[contractName][eventName]) && eventsAbi[contractName] && eventsAbi[contractName][eventName]) {
          addFilter(blockStream, contractName, eventName, eventsAbi[contractName][eventName], activeContracts, subscriptions.addSubscription, onEventCallbacks[contractName][eventName]);
        }
      });
    });
    blockStream.subscribeToOnLogAdded(subscriptions.onLogAdded);
    blockStream.subscribeToOnLogRemoved(subscriptions.onLogRemoved);
  }
  if (isFunction(onSetupComplete)) onSetupComplete();
}

module.exports = startListeners;
