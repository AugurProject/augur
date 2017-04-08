"use strict";

var unrollArray = require("ethrpc").unmarshal;

var parseAllLogsMessage = function (message, onMessage) {
  var i, len;
  if (message && message.length && message.constructor === Array) {
    for (i = 0, len = message.length; i < len; ++i) {
      if (message[i]) {
        if (message[i].constructor === Object && message[i].data) {
          message[i].data = unrollArray(message[i].data);
        }
        onMessage(message[i]);
      }
    }
  }
};

module.exports = parseAllLogsMessage;
