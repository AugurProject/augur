"use strict";

var speedomatic = require("speedomatic");
var createKeccakHash = require("keccak/js");
var serialize = require("./serialize");

function sha3(hashable) {
  return speedomatic.hex(createKeccakHash("keccak256").update(Buffer.from(serialize(hashable), "hex")).digest());
}

module.exports = sha3;
