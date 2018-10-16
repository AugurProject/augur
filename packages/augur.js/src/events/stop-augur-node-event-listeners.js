"use strict";

var augurNode = require("../augur-node");
var noop = require("../utils/noop");

/**
 * Removes all active listeners for events emitted by augur-node.
 * @param {function=} callback
 */
function stopAugurNodeEventListeners(callback) {
  augurNode.unsubscribeFromAllEvents(callback || noop);
}

module.exports = stopAugurNodeEventListeners;
