"use strict";

var speedomatic = require("speedomatic");
var clone = require("clone");
var formatTradeType = require("./format-trade-type");

var formatCommonFields = function (msg) {
  var fmt = clone(msg);
  if (msg.sender) fmt.sender = speedomatic.formatEthereumAddress(msg.sender);
  if (msg.timestamp) fmt.timestamp = parseInt(msg.timestamp, 16);
  if (msg.type) fmt.type = formatTradeType(msg.type);
  if (msg.price) fmt.price = speedomatic.unfixSigned(msg.price, "string");
  if (msg.amount) fmt.amount = speedomatic.unfix(msg.amount, "string");
  return fmt;
};

module.exports = formatCommonFields;
