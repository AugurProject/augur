"use strict";

var speedomatic = require("speedomatic");
var clone = require("clone");
var formatTradeType = require("./format-trade-type");

var formatCommonFields = function (msg) {
  var fmt = clone(msg);
  if (msg.sender != null) fmt.sender = speedomatic.formatEthereumAddress(msg.sender);
  if (msg.timestamp != null) fmt.timestamp = parseInt(msg.timestamp, 16);
  if (msg.orderType != null) fmt.orderType = formatTradeType(msg.orderType);
  if (msg.price != null) fmt.price = speedomatic.unfixSigned(msg.price, "string");
  if (msg.amount != null) fmt.amount = speedomatic.unfix(msg.amount, "string");
  return fmt;
};

module.exports = formatCommonFields;
