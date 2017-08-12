"use strict";

var insertIndexedLog = require("./insert-indexed-log");
var eventsAPI = require("../contracts").api.events;
var parseLogMessage = require("../filters/parse-message/parse-log-message");

// warning: mutates processedLogs, if passed
function processLogs(label, index, logs, extraField, processedLogs) {
  var parsed, i, numLogs;
  if (!processedLogs) processedLogs = (index) ? {} : [];
  for (i = 0, numLogs = logs.length; i < numLogs; ++i) {
    if (!logs[i].removed) {
      parsed = parseLogMessage(label, logs[i], eventsAPI[label].inputs);
      if (extraField && extraField.name) {
        parsed[extraField.name] = extraField.value;
      }
      if (index) {
        insertIndexedLog(processedLogs, parsed, index);
      } else {
        processedLogs.push(parsed);
      }
    }
  }
  return processedLogs;
}

module.exports = processLogs;
