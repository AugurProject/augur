"use strict";

var addFilter = require("./add-filter");
var contracts = require("../contracts");
var ethrpc = require("../rpc-interface");
var isFunction = require("../utils/is-function");
var subscriptions = require("./subscriptions");

/**
 * Start listening for specified events emitted by the Ethereum blockchain.
 * @param {Object.<function>} subscriptionCallbacks Callbacks to fire when events are received, keyed by contract name and event name.
 * @param {function=} onSetupComplete Called when all listeners are successfully set up.
 */
function startListeners(subscriptionCallbacks, onSetupComplete) {
  var eventsAbi = contracts.abi.events;
  var blockStream = ethrpc.getBlockStream();
  Object.keys(subscriptionCallbacks).forEach(function (contractName) {
    Object.keys(subscriptionCallbacks[contractName]).forEach(function (eventName) {
      if (isFunction(subscriptionCallbacks[contractName][eventName])) {
        addFilter(blockStream, contractName, eventName, eventsAbi[contractName][eventName], contracts[ethrpc.getNetworkID()], subscriptions.addSubscription, subscriptionCallbacks[contractName][eventName]);
      }
    });
  });
  blockStream.subscribeToOnLogAdded(subscriptions.onLogAdded);
  blockStream.subscribeToOnLogRemoved(subscriptions.onLogRemoved);
  if (isFunction(onSetupComplete)) onSetupComplete();
}

module.exports = startListeners;
