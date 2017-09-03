"use strict";

var speedomatic = require("speedomatic");

function parseMessage(message) {
  return JSON.parse(speedomatic.abiDecodeBytes(message));
}

module.exports = parseMessage;
