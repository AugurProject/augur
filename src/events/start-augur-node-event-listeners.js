"use strict";

var async = require("async");
var augurNode = require("../augur-node");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");
var noop = require("../utils/noop");

/**
 * Start listening for events emitted by augur-node.
 * @param {Object.<function>} eventCallbacks Callbacks to fire when events are received, keyed by event name.
 * @param {function=} onSetupComplete Called when all listeners are successfully set up.
 */
function startAugurNodeEventListeners(eventCallbacks, onSetupComplete) {
  if (!isFunction(onSetupComplete)) onSetupComplete = noop;
  if (!isObject(eventCallbacks)) return onSetupComplete(new Error("No callbacks found"));
  async.forEachOf(eventCallbacks, function (callback, eventName, nextEvent) {
    augurNode.subscribeToEvent(eventName, callback, nextEvent);
  }, onSetupComplete);
}

module.exports = startAugurNodeEventListeners;
