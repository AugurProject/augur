"use strict";

var speedomatic = require("speedomatic");

function convertBigNumberToHexString(bigNumber) {
  return speedomatic.prefixHex(bigNumber.toString(16));
}

module.exports = convertBigNumberToHexString;
