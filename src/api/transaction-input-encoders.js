"use strict";

var abi = require("augur-abi");

module.exports = {
  address: abi.format_address.bind(abi),
  int256: abi.format_int256.bind(abi),
  uint256: abi.format_int256.bind(abi),
  bytes32: abi.format_int256.bind(abi),
  "address[]": abi.format_address.bind(abi),
  "int256[]": abi.format_int256.bind(abi),
  "uint256[]": abi.format_int256.bind(abi),
  "bytes32[]": abi.format_int256.bind(abi)
};
