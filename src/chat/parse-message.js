"use strict";

var abi = require("augur-abi");

function parseMessage(message) {
  return JSON.parse(abi.decode_hex(message));
}

module.exports = parseMessage;
