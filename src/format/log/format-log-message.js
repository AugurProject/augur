"use strict";

var speedomatic = require("speedomatic");
var clone = require("clone");
var decodeTag = require("../tag/decode-tag");
var formatCommonFields = require("./format-common-fields");

var formatLogMessage = function (label, msg) {
  var fmt;
  switch (label) {
    case "Approval":
      fmt = clone(msg);
      fmt._owner = speedomatic.formatEthereumAddress(msg._owner);
      fmt._spender = speedomatic.formatEthereumAddress(msg._spender);
      fmt.value = speedomatic.unfix(msg.value);
      return fmt;
    case "Deposit":
      fmt = formatCommonFields(msg);
      fmt.value = speedomatic.unfix(msg.value, "string");
      return fmt;
    case "MakeOrder":
      fmt = formatCommonFields(msg);
      fmt.outcome = parseInt(msg.outcome, 16);
      return fmt;
    case "CancelOrder":
      fmt = formatCommonFields(msg);
      fmt.outcome = parseInt(msg.outcome, 16);
      fmt.cashRefund = speedomatic.unfix(msg.cashRefund, "string");
      return fmt;
    case "TakeOrder":
      fmt = formatCommonFields(msg);
      fmt.owner = speedomatic.formatEthereumAddress(msg.owner); // maker
      fmt.outcome = parseInt(msg.outcome, 16);
      return fmt;
    case "CreateMarket":
      fmt = formatCommonFields(msg);
      fmt.marketCreationFee = speedomatic.unfix(msg.marketCreationFee, "string");
      fmt.eventBond = speedomatic.unfix(msg.eventBond, "string");
      fmt.topic = decodeTag(msg.topic);
      return fmt;
    case "Transfer":
      fmt = clone(msg);
      fmt._from = speedomatic.formatEthereumAddress(msg._from);
      fmt._to = speedomatic.formatEthereumAddress(msg._to);
      fmt._value = speedomatic.unfix(msg._value);
      return fmt;
    case "SubmitReport":
      fmt = formatCommonFields(msg);
      return fmt;
    case "Withdraw":
      fmt = formatCommonFields(msg);
      fmt.to = speedomatic.formatEthereumAddress(msg.to);
      fmt.value = speedomatic.unfix(msg.value, "string");
      return fmt;
    default:
      return formatCommonFields(msg);
  }
};

module.exports = formatLogMessage;
