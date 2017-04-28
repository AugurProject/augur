"use strict";

var abi = require("augur-abi");
var serialize = require("./serialize");

var sha3 = function (hashable) {
  return abi.prefix_hex(abi.sha3(serialize(hashable)));
};

module.exports = sha3;
