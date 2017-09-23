"use strict";

var addFilter = require("./add-filter");
var contracts = require("../contracts");
var ethrpc = require("../rpc-interface");
var isFunction = require("../utils/is-function");
var subscriptions = require("./subscriptions");

/**
 * Start listening for specified events emitted by the Ethereum blockchain.
 * @param {Object} p Parameters object.
 * @param {Object.<string>} p.contracts Ethereum contract addresses as hexadecimal strings, keyed by contract name.
 * @param {Object.<function>} p.subscriptionCallbacks Callbacks to fire when events are received, keyed by event name.
 * @param {function=} onSetupComplete Called when all listeners are successfully set up.
 */
function startListeners(p, onSetupComplete) {
  var eventsAbi = contracts.events.abi;
  var blockStream = ethrpc.getBlockStream();
  Object.keys(p.subscriptionCallbacks).forEach(function (contractName) {
    Object.keys(p.subscriptionCallbacks[contractName]).forEach(function (eventName) {
      if (isFunction(p.subscriptionCallbacks[contractName][eventName])) {
        addFilter(blockStream, contractName, eventName, eventsAbi[contractName][eventName], p.contracts, subscriptions.addSubscription, p.subscriptionCallbacks[contractName][eventName]);
      }
    });
  });
  blockStream.subscribeToOnLogAdded(subscriptions.onLogAdded);
  blockStream.subscribeToOnLogRemoved(subscriptions.onLogRemoved);
  if (isFunction(onSetupComplete)) onSetupComplete();
}

module.exports = startListeners;
