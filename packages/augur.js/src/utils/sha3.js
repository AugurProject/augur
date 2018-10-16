"use strict";

var speedomatic = require("speedomatic");
var createKeccakHash = require("keccak/js");

function sha3(hashable) {
  return speedomatic.prefixHex(createKeccakHash("keccak256").update(Buffer.from(speedomatic.serialize(hashable), "hex")).digest().toString("hex"));
}

module.exports = sha3;
