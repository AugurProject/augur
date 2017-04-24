"use strict";

var abi = require("augur-abi");

function buildTopicsList(eventSignature, eventInputs, params) {
  var i, numInputs;
  var topics = [eventSignature];
  for (i = 0, numInputs = eventInputs.length; i < numInputs; ++i) {
    if (eventInputs[i].indexed) {
      if (params[eventInputs[i].name]) {
        topics.push(abi.format_int256(params[eventInputs[i].name]));
      } else {
        topics.push(null);
      }
    }
  }
  return topics;
}

module.exports = buildTopicsList;
