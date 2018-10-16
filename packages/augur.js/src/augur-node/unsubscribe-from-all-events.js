"use strict";

var async = require("async");
var augurNodeState = require("./state");
var unsubscribeFromEvent = require("./unsubscribe-from-event");

function unsubscribeFromAllEvents(callback) {
  async.each(augurNodeState.getSubscribedEventNames(), function (eventName, nextEvent) {
    unsubscribeFromEvent(eventName, nextEvent);
  }, callback);
}

module.exports = unsubscribeFromAllEvents;
