"use strict";

var abi = require("augur-abi");

function buildTopicsList(event, params) {
  var i, numInputs;
  var topics = [event.signature];
  var inputs = event.inputs;
  for (i = 0, numInputs = inputs.length; i < numInputs; ++i) {
    if (inputs[i].indexed) {
      if (params[inputs[i].name]) {
        topics.push(abi.format_int256(params[inputs[i].name]));
      } else {
        topics.push(null);
      }
    }
  }
  return topics;
}

module.exports = buildTopicsList;
