"use strict";

module.exports = {
  connect: require("./connect"),
  getContractAddresses: require("./get-sync-data"),
  getSyncData: require("./get-sync-data"),
  submitRequest: require("./submit-json-rpc-request"),
  subscribeToEvent: require("./subscribe-to-event"),
  unsubcribeFromEvent: require("./unsubscribe-from-event"),
  unsubscribeFromAllEvents: require("./unsubscribe-from-all-events"),
};
