"use strict";

var async = require("async");
var augurNode = require("../augur-node");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");
var noop = require("../utils/noop");

/**
 * Start listening for events emitted by augur-node.
 * @param {Object.<function>} eventCallbacks Callbacks to fire when events are received, keyed by event name.
 * @param {function=} onSetupComplete Called when all listeners are successfully set up, or if `eventCallbacks` is improperly formatted.
 */
function startAugurNodeEventListeners(eventCallbacks, onSetupComplete) {
  if (!isFunction(onSetupComplete)) onSetupComplete = noop;
  if (!isObject(eventCallbacks)) return onSetupComplete(new Error("No callbacks found"));

  var startListeners = function (err) {
    if (err) return onSetupComplete(err);
    async.forEachOf(eventCallbacks, function (callback, eventName, nextEvent) {
      augurNode.subscribeToEvent(eventName, callback, nextEvent);
    }, onSetupComplete);
  };

  // Verify that all callbacks in `eventCallbacks` are functions before starting listeners
  async.forEachOf(eventCallbacks, function (callback, eventName, nextEvent) {
    if (typeof callback !== "function") return nextEvent(new Error("Callback for " + eventName + " is not a function"));
    nextEvent();
  }, startListeners);
}

module.exports = startAugurNodeEventListeners;
