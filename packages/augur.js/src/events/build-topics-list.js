"use strict";

var speedomatic = require("speedomatic");

function buildTopicsList(eventSignature, eventInputs, params) {
  var i, numInputs;
  var topics = [eventSignature];
  for (i = 0, numInputs = eventInputs.length; i < numInputs; ++i) {
    if (eventInputs[i].indexed) {
      if (params[eventInputs[i].name]) {
        topics.push(speedomatic.formatInt256(params[eventInputs[i].name]));
      } else {
        topics.push(null);
      }
    }
  }
  return topics;
}

module.exports = buildTopicsList;
