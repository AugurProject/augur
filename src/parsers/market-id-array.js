"use strict";

var speedomatic = require("speedomatic");

module.exports = function (markets) {
  if (!Array.isArray(markets)) return markets;
  return markets.map(speedomatic.formatInt256);
};
