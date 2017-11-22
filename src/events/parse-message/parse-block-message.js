"use strict";

function parseBlockMessage(message, onMessage) {
  if (message) {
    if (message.length && Array.isArray(message)) {
      for (var i = 0, len = message.length; i < len; ++i) {
        if (message[i]) {
          onMessage(message[i]);
        }
      }
    } else {
      onMessage(message);
    }
  }
}

module.exports = parseBlockMessage;
