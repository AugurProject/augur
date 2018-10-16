"use strict";

var speedomatic = require("speedomatic");
var formatLoggedEventTopic = require("./format-logged-event-topic");

function formatLoggedEventInputs(loggedTopics, loggedData, abiEventInputs) {
  var decodedData = speedomatic.abiDecodeData(abiEventInputs, loggedData);
  var topicIndex = 0;
  var dataIndex = 0;
  return abiEventInputs.reduce(function (p, eventInput) {
    if (eventInput.indexed) {
      p[eventInput.name] = formatLoggedEventTopic(loggedTopics[topicIndex + 1], eventInput.type);
      ++topicIndex;
    } else {
      p[eventInput.name] = decodedData[dataIndex];
      ++dataIndex;
    }
    return p;
  }, {});
}

module.exports = formatLoggedEventInputs;
