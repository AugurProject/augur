"use strict";

var abi = require("augur-abi");
var sha3 = require("../../utils/sha3");

// report in fixed-point
function makeHash(salt, report, event, from) {
  return sha3([from, abi.hex(salt), report, event]);
}

module.exports = makeHash;
