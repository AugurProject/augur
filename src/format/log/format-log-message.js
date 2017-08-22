"use strict";

var abi = require("augur-abi");
var clone = require("clone");
var decodeTag = require("../tag/decode-tag");
var formatCommonFields = require("./format-common-fields");

var formatLogMessage = function (label, msg) {
  var fmt;
  switch (label) {
    case "Approval":
      fmt = clone(msg);
      fmt._owner = abi.format_address(msg._owner);
      fmt._spender = abi.format_address(msg._spender);
      fmt.value = abi.unfix(msg.value);
      return fmt;
    case "Deposit":
      fmt = formatCommonFields(msg);
      fmt.value = abi.unfix(msg.value, "string");
      return fmt;
    case "MakeOrder":
      fmt = formatCommonFields(msg);
      fmt.outcome = parseInt(msg.outcome, 16);
      return fmt;
    case "CancelOrder":
      fmt = formatCommonFields(msg);
      fmt.outcome = parseInt(msg.outcome, 16);
      fmt.cashRefund = abi.unfix(msg.cashRefund, "string");
      return fmt;
    case "TakeOrder":
      fmt = formatCommonFields(msg);
      fmt.owner = abi.format_address(msg.owner); // maker
      fmt.outcome = parseInt(msg.outcome, 16);
      return fmt;
    case "CreateMarket":
      fmt = formatCommonFields(msg);
      fmt.marketCreationFee = abi.unfix(msg.marketCreationFee, "string");
      fmt.eventBond = abi.unfix(msg.eventBond, "string");
      fmt.topic = decodeTag(msg.topic);
      return fmt;
    case "Transfer":
      fmt = clone(msg);
      fmt._from = abi.format_address(msg._from);
      fmt._to = abi.format_address(msg._to);
      fmt._value = abi.unfix(msg._value);
      return fmt;
    case "SubmitReport":
      fmt = formatCommonFields(msg);
      return fmt;
    case "Withdraw":
      fmt = formatCommonFields(msg);
      fmt.to = abi.format_address(msg.to);
      fmt.value = abi.unfix(msg.value, "string");
      return fmt;
    default:
      return formatCommonFields(msg);
  }
};

module.exports = formatLogMessage;
