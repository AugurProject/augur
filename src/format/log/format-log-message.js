"use strict";

var assign = require("lodash.assign");
var immutableDelete = require("immutable-delete");
var speedomatic = require("speedomatic");
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
          var formattedMessage = {
            extraInfo: extraInfo,
            marketCreationFee: speedomatic.unfix(message.marketCreationFee, "string"),
            topic: decodeTag(message.topic),
          };
          if (message.marketType === 1) {
            formattedMessage.outcomes = message.outcomes.map(function (outcome) {
              return decodeTag(outcome);
            });
          }
          return assign({}, immutableDelete(message, "outcomes"), formattedMessage);
        case "WinningTokensRedeemed":
          return assign({}, message, {
            amountRedeemed: speedomatic.unfix(message.amountRedeemed, "string"),
            reportingFeesReceived: speedomatic.unfix(message.reportingFeesReceived, "string"),
          });
        case "ReportSubmitted":
          return assign({}, message, {
            amountStaked: speedomatic.unfix(message.amountStaked, "string"),
          });
        case "TokensTransferred":
          return assign({}, message, {
            value: speedomatic.unfix(message.value, "string"),
          });
        default:
          return message;
      }
    case "LegacyReputationToken":
      switch (eventName) {
        case "Approval":
          return assign({}, message, {
            value: speedomatic.unfix(message.value, "string"),
          });
        case "Transfer":
          return assign({}, message, {
            value: speedomatic.unfix(message.value, "string"),
          });
        default:
          return message;
      }
    default:
      return message;
  }
}

module.exports = formatLogMessage;
