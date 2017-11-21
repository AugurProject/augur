"use strict";

var assign = require("lodash.assign");
var unfix = require("speedomatic").unfix;
var decodeTag = require("../tag/decode-tag");

function formatLogMessage(contractName, eventName, message) {
  switch (contractName) {
    case "Augur":
      switch (eventName) {
        case "MarketCreated":
          var extraInfo;
          try {
            extraInfo = JSON.parse(message.extraInfo);
          } catch (exc) {
            if (exc.constructor !== SyntaxError) throw exc;
            extraInfo = null;
          }
          return assign({}, message, {
            extraInfo: extraInfo,
            marketCreationFee: unfix(message.marketCreationFee, "string"),
            topic: decodeTag(message.topic),
          });
        case "WinningTokensRedeemed":
          return assign({}, message, {
            amountRedeemed: unfix(message.amountRedeemed, "string"),
            reportingFeesReceived: unfix(message.reportingFeesReceived, "string"),
          });
        case "ReportSubmitted":
          return assign({}, message, {
            amountStaked: unfix(message.amountStaked, "string"),
          });
        case "TokensTransferred":
          return assign({}, message, {
            value: unfix(message.value, "string"),
          });
        default:
          return message;
      }
    case "LegacyRepContract":
      switch (eventName) {
        case "Approval":
          return assign({}, message, {
            fxpValue: unfix(message.fxpValue, "string"),
          });
        case "Transfer":
          return assign({}, message, {
            value: unfix(message.value, "string"),
          });
        default:
          return message;
      }
    default:
      return message;
  }
}

module.exports = formatLogMessage;
