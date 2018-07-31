"use strict";

var assign = require("lodash").assign;
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
            minPrice: speedomatic.unfix(message.minPrice, "string"),
            maxPrice: speedomatic.unfix(message.maxPrice, "string"),
          };
          if (message.marketType === "1") {
            formattedMessage.outcomes = message.outcomes.map(function (outcome) {
              return decodeTag(outcome);
            });
          }
          return assign({}, immutableDelete(message, "outcomes"), formattedMessage);
        case "ReportSubmitted":
          return assign({}, message, {
            amountStaked: speedomatic.unfix(message.amountStaked, "string"),
          });
        default:
          return message;
      }
    default:
      return message;
  }
}

module.exports = formatLogMessage;
