"use strict";
var ee = require("event-emitter");

module.exports = ee({
  connect: require("./connect"),
  submitRequest: require("./submit-json-rpc-request"),
  subscribeToEvent: require("./subscribe-to-event"),
  unsubcribeFromEvent: require("./unsubscribe-from-event"),
  unsubscribeFromAllEvents: require("./unsubscribe-from-all-events"),
});
