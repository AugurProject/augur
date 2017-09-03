"use strict";

var speedomatic = require("speedomatic");

module.exports.fix = function (n) {
  return speedomatic.formatInt256(speedomatic.fix(n, "hex"));
};

module.exports.stripFix = function (n) {
  return speedomatic.strip0xPrefix(speedomatic.formatInt256(speedomatic.fix(n, "hex")));
};
