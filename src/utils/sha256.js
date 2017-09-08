"use strict";

var crypto = require("crypto");
var speedomatic = require("speedomatic");
var serialize = require("./serialize");

var sha256 = function (hashable) {
  return speedomatic.hex(speedomatic.prefixHex(crypto.createHash("sha256").update(serialize(hashable)).digest("hex")), true);
};

module.exports = sha256;
