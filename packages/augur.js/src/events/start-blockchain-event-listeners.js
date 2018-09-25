"use strict";

var async = require("async");
var addFilter = require("./add-filter");
var subscriptions = require("./subscriptions");
var contracts = require("../contracts");
var ethrpc = require("../rpc-interface");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");
var noop = require("../utils/noop");

/**
 * Start listening for events emitted by the Ethereum blockchain.
 * @param {Object.<function>=} eventCallbacks Callbacks to fire when events are received, keyed by contract name and event name.
 * @param {function=} onSetupComplete Called when all listeners are successfully set up.
 */
function startBlockchainEventListeners(eventCallbacks, startingBlockNumber, onSetupComplete) {
  if (!isFunction(onSetupComplete)) onSetupComplete = noop;
  if (typeof startingBlockNumber !== "undefined") {
    console.log("Starting blockstream at block ", startingBlockNumber);
    ethrpc.startBlockStream(startingBlockNumber);
  }
  var blockStream = ethrpc.getBlockStream();
  if (!blockStream) return onSetupComplete(new Error("Not connected to Ethereum"));
  if (!isObject(eventCallbacks)) return onSetupComplete(new Error("No event callbacks found"));
  var eventsAbi = contracts.abi.events;
  var activeContracts = contracts.addresses[ethrpc.getNetworkID()];
  blockStream.subscribeToOnLogAdded(subscriptions.onLogAdded);
  blockStream.subscribeToOnLogRemoved(subscriptions.onLogRemoved);
  async.forEachOf(eventCallbacks, function (callbacks, contractName, nextContract) {
    if (!addFilter(blockStream, contractName, callbacks, eventsAbi[contractName], activeContracts, subscriptions.addSubscription)) {
      return nextContract(new Error("Add filter failed for contract" + contractName));
    }
    nextContract(null);
  }, function (err) {
    if (err) return onSetupComplete(err);
    onSetupComplete(null);
  });
}

module.exports = startBlockchainEventListeners;
