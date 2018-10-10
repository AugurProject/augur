"use strict";

var ethrpc = require("../rpc-interface");
var subscriptions = require("./subscriptions");

/**
 * Stop listening for blocks and block removals.
 * @return {boolean} True if listeners were successfully stopped; false otherwise.
 */
function stopBlockListeners() {
  var blockStream = ethrpc.getBlockStream();
  if (!blockStream) return false;
  var blockSubscriptions = subscriptions.getSubscriptions().block;
  if (blockSubscriptions.added) {
    blockStream.unsubscribeFromOnBlockAdded(blockSubscriptions.added);
    subscriptions.removeOnBlockAddedSubscription();
  }
  if (blockSubscriptions.removed) {
    blockStream.unsubscribeFromOnBlockRemoved(blockSubscriptions.removed);
    subscriptions.removeOnBlockRemovedSubscription();
  }
  return true;
}

module.exports = stopBlockListeners;
