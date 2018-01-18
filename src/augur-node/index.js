"use strict";

module.exports = {
  connect: require("./connect"),
  getContractAddresses: require("./get-contract-addresses"),
  submitRequest: require("./submit-json-rpc-request"),
  subscribeToEvent: require("./subscribe-to-event"),
  unsubcribeFromEvent: require("./unsubscribe-from-event"),
  unsubscribeFromAllEvents: require("./unsubscribe-from-all-events"),
};
