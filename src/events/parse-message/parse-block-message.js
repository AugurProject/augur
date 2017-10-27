"use strict";

function parseBlockMessage(message, onMessage) {
  if (message) {
    if (message.length && Array.isArray(message)) {
      for (var i = 0, len = message.length; i < len; ++i) {
        if (message[i] && message[i].number) {
          onMessage(message[i].number);
        } else {
          onMessage(message[i]);
        }
      }
    } else if (message.number) {
      onMessage(message.number);
    }
  }
}

module.exports = parseBlockMessage;
