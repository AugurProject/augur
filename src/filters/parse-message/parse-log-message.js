"use strict";

var unrollArray = require("ethrpc").unmarshal;
var formatLogMessage = require("../format/log/format-log-message");

var parseLogMessage = function (label, msg, inputs, onMessage) {
  var i, parsed, topicIndex, dataIndex, topics, data;
  // console.log("parseLogMessage label:", label);
  // console.log("parseLogMessage msg:", JSON.stringify(msg, null, 4));
  if (msg) {
    switch (msg.constructor) {
      case Array:
        for (i = 0; i < msg.length; ++i) {
          parseLogMessage(label, msg[i], inputs, onMessage);
        }
        break;
      case Object:
        if (!msg.error && msg.topics && msg.data) {
          parsed = {};
          topicIndex = 0;
          dataIndex = 0;
          topics = msg.topics;
          data = unrollArray(msg.data);
          if (data && data.constructor !== Array) data = [data];
          for (i = 0; i < inputs.length; ++i) {
            parsed[inputs[i].name] = 0;
            if (inputs[i].indexed) {
              parsed[inputs[i].name] = topics[topicIndex + 1];
              ++topicIndex;
            } else {
              parsed[inputs[i].name] = data[dataIndex];
              ++dataIndex;
            }
          }
          parsed.blockNumber = parseInt(msg.blockNumber, 16);
          parsed.transactionHash = msg.transactionHash;
          parsed.removed = msg.removed;
          if (!onMessage) return formatLogMessage(label, parsed);
          onMessage(formatLogMessage(label, parsed));
        }
        break;
      default:
        console.warn("unknown event message:", msg);
    }
  }
};

module.exports = parseLogMessage;
