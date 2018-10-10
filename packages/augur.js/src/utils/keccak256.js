"use strict";

var createKeccakHash = require("keccak/js");

function keccak256(buffer) {
  return createKeccakHash("keccak256").update(buffer).digest();
}

module.exports = keccak256;
