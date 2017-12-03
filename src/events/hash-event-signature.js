"use strict";

// TODO rename to hashEventSignature?

var prefixHex = require("speedomatic").prefixHex;
var keccak256 = require("../utils/keccak256");

function hashEventSignature(eventName) {
  return prefixHex(keccak256(Buffer.from(eventName, "utf8")).toString("hex"));
}

module.exports = hashEventSignature;
