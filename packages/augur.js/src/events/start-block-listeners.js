"use strict";

var subscriptions = require("./subscriptions");
var parseBlockMessage = require("./parse-message/parse-block-message");
var ethrpc = require("../rpc-interface");
var isFunction = require("../utils/is-function");

/**
 * Start listening for blocks.
 * @param {function=} blockCallbacks.onAdded Callback to fire when new blocks are received.
 * @param {function=} blockCallbacks.onRemoved Callback to fire when blocks are removed.
 * @return {boolean} True if listeners were successfully started; false otherwise.
 */
function startBlockListeners(blockCallbacks) {
  var blockStream = ethrpc.getBlockStream();
  if (!blockStream) return false;
  if (isFunction(blockCallbacks.onAdded)) {
    subscriptions.addOnBlockAddedSubscription(blockStream.subscribeToOnBlockAdded(function (newBlock) {
      parseBlockMessage(newBlock, blockCallbacks.onAdded);
    }));
  }
  if (isFunction(blockCallbacks.onRemoved)) {
    subscriptions.addOnBlockRemovedSubscription(blockStream.subscribeToOnBlockRemoved(function (removedBlock) {
      parseBlockMessage(removedBlock, blockCallbacks.onRemoved);
    }));
  }
  return true;
}

module.exports = startBlockListeners;
