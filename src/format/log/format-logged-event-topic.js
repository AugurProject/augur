"use strict";

var BigNumber = require("bignumber.js");
var speedomatic = require("speedomatic");

function formatLoggedEventTopic(unformattedValue, inputType) {
  switch (inputType) {
    case "int256":
      return new BigNumber(unformattedValue, 16).toFixed();
    case "uint256":
      return new BigNumber(unformattedValue, 16).abs().toFixed();
    case "int256[]":
    case "uint256[]":
      return unformattedValue.map(function (value) {
        return formatLoggedEventTopic(value, inputType.slice(0, -2));
      });
    case "address":
    case "address[]":
      return speedomatic.formatEthereumAddress(unformattedValue);
    case "bytes32":
    case "bytes32[]":
      return speedomatic.formatInt256(unformattedValue);
    default:
      return unformattedValue;
  }
}

module.exports = formatLoggedEventTopic;
