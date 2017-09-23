"use strict";

var addFilter = require("./add-filter");
var ethrpc = require("../rpc-interface");
var isFunction = require("../utils/is-function");
var subscriptions = require("./subscriptions");

/**
 * Start listening for specified events emitted by the Ethereum blockchain.
 * @param {Object} p Parameters object.
 * @param {Object.<string>} p.contracts Ethereum contract addresses as hexadecimal strings, keyed by contract name.
 * @param {Object} p.eventsAbi Static ABI map of Augur events, in the format of api/bind-contract-function.
 * @param {Object.<function>} p.subscriptionCallbacks Callbacks to fire when events are received, keyed by event name.
 * @param {function=} onSetupComplete Called when all listeners are successfully set up.
 */
function startListeners(p, onSetupComplete) {
  var blockStream = ethrpc.getBlockStream();
  Object.keys(p.subscriptionCallbacks).map(function (eventName) {
    if (isFunction(p.subscriptionCallbacks[eventName])) {
      addFilter(blockStream, eventName, p.eventsAbi[eventName], p.contracts, subscriptions.addSubscription, p.subscriptionCallbacks[eventName]);
    }
  });
  blockStream.subscribeToOnLogAdded(subscriptions.onLogAdded);
  blockStream.subscribeToOnLogRemoved(subscriptions.onLogRemoved);
  if (isFunction(onSetupComplete)) onSetupComplete();
}

module.exports = startListeners;
