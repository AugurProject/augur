"use strict";

var prefixHex = require("speedomatic").prefixHex;
var keccak256 = require("../utils/keccak256");

function convertEventNameToSignature(eventName) {
  return prefixHex(keccak256(Buffer.from(eventName, "utf8")).toString("hex"));
}

module.exports = convertEventNameToSignature;
