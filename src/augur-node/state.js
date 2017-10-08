"use strict";

var state = {
  numRequests: 0,
  jsonRpcCallbacks: {},
  transport: null
};

module.exports.incrementNumRequests = function () {
  state.numRequests++;
};

module.exports.setCallback = function (id, callback) {
  state.jsonRpcCallbacks[id] = callback;
};

module.exports.setTransport = function (transport) {
  state.transport = transport;
};

module.exports.getNumRequests = function () {
  return state.numRequests;
};

module.exports.getCallback = function (id) {
  return state.jsonRpcCallbacks[id];
};

module.exports.getTransport = function () {
  return state.transport;
};
