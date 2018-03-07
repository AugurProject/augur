"use strict";

var setFrom = require("./set-from");
var setupEventsAbi = require("./setup-events-abi");
var setupFunctionsAbi = require("./setup-functions-abi");
var connect = require("./connect");

module.exports = {
  setFrom: setFrom,
  setupEventsAbi: setupEventsAbi,
  setupFunctionsAbi: setupFunctionsAbi,
  connect: connect
};
