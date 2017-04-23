"use strict";

var parseMessage = require("./parse-message");

function parseMessages(messages) {
  var i, numMessages, parsedMessages = [];
  if (Array.isArray(messages) && messages.length) {
    for (i = 0, numMessages = messages.length; i < numMessages; ++i) {
      parsedMessages.push(parseMessage(messages[i].payload));
    }
  }
  return parsedMessages;
}

module.exports = parseMessages;
