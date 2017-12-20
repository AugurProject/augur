"use strict";

var speedomatic = require("speedomatic");
var keccak256 = require("../utils/keccak256");

function hashEventSignature(eventName) {
  return speedomatic.formatInt256(keccak256(Buffer.from(eventName, "utf8")).toString("hex"));
}

module.exports = hashEventSignature;
