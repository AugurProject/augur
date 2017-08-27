"use strict";

var abi = require("augur-abi");

module.exports.fix = function (n) {
  return abi.format_int256(abi.fix(n, "hex"));
};

module.exports.stripFix = function (n) {
  return abi.strip_0x(abi.format_int256(abi.fix(n, "hex")));
};
