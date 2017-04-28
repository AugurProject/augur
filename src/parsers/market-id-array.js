"use strict";

var abi = require("augur-abi");

module.exports = function (markets) {
  if (!Array.isArray(markets)) return markets;
  return markets.map(abi.format_int256);
};
