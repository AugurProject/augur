"use strict";

var state = {
  numRequests: 0,
  jsonRpcCallbacks: {},
  jsonRpcEventCallbacks: {},
  transport: null,
};

module.exports.incrementNumRequests = function () {
  state.numRequests++;
};

module.exports.setCallback = function (id, callback) {
  state.jsonRpcCallbacks[id] = callback;
};

module.exports.getCallback = function (id) {
  return state.jsonRpcCallbacks[id];
};

module.exports.removeCallback = function (id) {
  delete state.jsonRpcCallbacks[id];
};

module.exports.setEventCallback = function (id, callback) {
  state.jsonRpcEventCallbacks[id] = callback;
};

module.exports.getEventCallback = function (id) {
  return state.jsonRpcEventCallbacks[id];
};

module.exports.getSubscribedEventNames = function () {
  return Object.keys(state.jsonRpcEventCallbacks);
};

module.exports.removeEventCallback = function (id) {
  delete state.jsonRpcEventCallbacks[id];
};

module.exports.setTransport = function (transport) {
  state.transport = transport;
};

module.exports.getNumRequests = function () {
  return state.numRequests;
};

module.exports.getTransport = function () {
  return state.transport;
};
