"use strict";

var speedomatic = require("speedomatic");

module.exports = {
  address: speedomatic.formatEthereumAddress.bind(speedomatic),
  int256: speedomatic.formatInt256.bind(speedomatic),
  uint256: speedomatic.formatInt256.bind(speedomatic),
  bytes32: speedomatic.formatInt256.bind(speedomatic),
  "address[]": speedomatic.formatEthereumAddress.bind(speedomatic),
  "int256[]": speedomatic.formatInt256.bind(speedomatic),
  "uint256[]": speedomatic.formatInt256.bind(speedomatic),
  "bytes32[]": speedomatic.formatInt256.bind(speedomatic),
};
