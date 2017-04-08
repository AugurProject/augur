"use strict";

var abi = require("augur-abi");
var clone = require("clone");
var formatTradeType = require("./format-trade-type");

var formatCommonFields = function (msg) {
  var fmt = clone(msg);
  if (msg.sender) fmt.sender = abi.format_address(msg.sender);
  if (msg.timestamp) fmt.timestamp = parseInt(msg.timestamp, 16);
  if (msg.type) fmt.type = formatTradeType(msg.type);
  if (msg.price) fmt.price = abi.unfix_signed(msg.price, "string");
  if (msg.amount) fmt.amount = abi.unfix(msg.amount, "string");
  return fmt;
};

module.exports = formatCommonFields;
