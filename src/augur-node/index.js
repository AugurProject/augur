"use strict";
var EventEmitter = require("event-emitter");

module.exports = EventEmitter({
  connect: require("./connect"),
  submitRequest: require("./submit-json-rpc-request"),
  subscribeToEvent: require("./subscribe-to-event"),
  unsubcribeFromEvent: require("./unsubscribe-from-event"),
  unsubscribeFromAllEvents: require("./unsubscribe-from-all-events"),
});
