"use strict";

var crypto = require("crypto");
var abi = require("augur-abi");
var serialize = require("./serialize");

var sha256 = function (hashable) {
  return abi.hex(abi.prefix_hex(crypto.createHash("sha256").update(serialize(hashable)).digest("hex")), true);
};

module.exports = sha256;
