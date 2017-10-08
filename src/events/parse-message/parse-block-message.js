"use strict";

var parseBlockMessage = function (message, onMessage) {
  var i, len;
  if (message) {
    if (message.length && message.constructor === Array) {
      for (i = 0, len = message.length; i < len; ++i) {
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
};

module.exports = parseBlockMessage;
